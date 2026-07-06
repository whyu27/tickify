const { pool } = require('../config/database');

/**
 * Verify a ticket by ticketIdOnChain
 * @param {string|number} ticketIdOnChain - The on-chain ticket ID
 * @param {number} organizerId - The organizer's user ID
 * @returns {Object} Ticket verification result
 */
const verifyTicket = async (ticketIdOnChain, organizerId) => {
  try {
    const query = `
      SELECT 
        t.ticket_id_onchain,
        t.status,
        t.owner_wallet,
        t.event_id,
        e.title as event_name,
        e.organizer_id,
        u.wallet_address
      FROM tickets t
      JOIN events e ON t.event_id = e.id
      JOIN users u ON t.participant_id = u.id
      WHERE t.ticket_id_onchain = $1
    `;

    const result = await pool.query(query, [ticketIdOnChain]);

    // Ticket not found
    if (result.rows.length === 0) {
      return {
        ticketId: ticketIdOnChain,
        eventName: null,
        walletAddress: null,
        status: 'invalid',
        eventId: null,
      };
    }

    const ticket = result.rows[0];

    // Check if organizer owns this event
    if (ticket.organizer_id !== organizerId) {
      return {
        ticketId: ticketIdOnChain,
        eventName: ticket.event_name,
        walletAddress: ticket.wallet_address,
        status: 'invalid',
        eventId: ticket.event_id,
      };
    }

    // Return ticket details
    return {
      ticketId: ticket.ticket_id_onchain,
      eventName: ticket.event_name,
      walletAddress: ticket.wallet_address || ticket.owner_wallet,
      status: ticket.status, // 'active' or 'used'
      eventId: ticket.event_id,
    };
  } catch (error) {
    console.error('Error in verifyTicket service:', error);
    throw error;
  }
};

/**
 * Check in a ticket (mark as used)
 * @param {string|number} ticketIdOnChain - The on-chain ticket ID
 * @param {number} organizerId - The organizer's user ID
 * @returns {Object} Check-in result
 */
const checkInTicket = async (ticketIdOnChain, organizerId) => {
  try {
    // First verify the ticket
    const verification = await verifyTicket(ticketIdOnChain, organizerId);

    // Check if ticket is invalid
    if (verification.status === 'invalid') {
      throw new Error('Ticket not found or unauthorized');
    }

    // Check if ticket is already used
    if (verification.status === 'used') {
      throw new Error('Ticket already used');
    }

    // Check if ticket is not active (should not happen, but defensive check)
    if (verification.status !== 'active') {
      throw new Error('Ticket is not active');
    }

    // Update ticket to used status
    const updateQuery = `
      UPDATE tickets
      SET 
        status = 'used',
        used_at = NOW(),
        verified_by = $1
      WHERE ticket_id_onchain = $2 AND status = 'active'
      RETURNING *
    `;

    const result = await pool.query(updateQuery, [organizerId, ticketIdOnChain]);

    if (result.rows.length === 0) {
      throw new Error('Failed to check in ticket - ticket may have been used concurrently');
    }

    return {
      ticketId: ticketIdOnChain,
      status: 'used',
      checkedInAt: result.rows[0].used_at,
    };
  } catch (error) {
    console.error('Error in checkInTicket service:', error);
    throw error;
  }
};

/**
 * Get all tickets purchased by a participant
 * @param {number} participantId - The participant's user ID
 * @returns {Array<Object>} List of purchased tickets with event details
 */
const getParticipantTickets = async (participantId) => {
  try {
    const query = `
      SELECT 
        t.id,
        t.ticket_id_onchain,
        t.event_id,
        t.participant_id,
        t.owner_wallet,
        t.transaction_hash,
        t.status,
        t.used_at,
        t.created_at,
        e.title AS event_title,
        e.location AS event_location,
        e.event_date AS event_date,
        e.banner_url AS event_banner_url,
        e.price_eth AS event_price_eth
      FROM tickets t
      JOIN events e ON t.event_id = e.id
      WHERE t.participant_id = $1 AND (t.mint_status IS NULL OR t.mint_status = 'SUCCESS')
      ORDER BY t.created_at DESC
    `;

    const result = await pool.query(query, [participantId]);

    return result.rows.map(row => ({
      id: row.id,
      ticket_id_onchain: row.ticket_id_onchain ? Number(row.ticket_id_onchain) : null,
      token_id: row.ticket_id_onchain ? Number(row.ticket_id_onchain) : null,
      event_id: row.event_id,
      participant_id: row.participant_id,
      owner_wallet: row.owner_wallet,
      transaction_hash: row.transaction_hash,
      status: row.status,
      used_at: row.used_at,
      created_at: row.created_at,
      event: {
        id: row.event_id,
        title: row.event_title,
        location: row.event_location,
        event_date: row.event_date,
        banner_url: row.event_banner_url,
        price_eth: row.event_price_eth
      }
    }));
  } catch (error) {
    console.error('Error in getParticipantTickets service:', error);
    throw error;
  }
};

/**
 * Create a pending ticket record
 * @param {number} userId - The participant's user ID
 * @param {number} eventId - The event ID
 * @param {string} walletAddress - The owner's wallet address
 * @returns {Promise<Object>} The created ticket record
 */
const createPendingTicket = async (userId, eventId, walletAddress) => {
  try {
    const result = await pool.query(
      `INSERT INTO tickets (participant_id, user_id, event_id, owner_wallet, wallet_address, mint_status, status)
       VALUES ($1, $1, $2, $3, $3, 'PENDING', 'active')
       RETURNING *`,
      [userId, eventId, walletAddress]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error in createPendingTicket service:', error);
    throw error;
  }
};

/**
 * Update a ticket to SUCCESS status and save tokenId/txHash
 * @param {number} ticketId - The database ticket record ID
 * @param {string|number} tokenId - The on-chain minted token ID
 * @param {string} txHash - The minting transaction hash
 * @returns {Promise<Object>} The updated ticket record
 */
const updateTicketSuccess = async (ticketId, tokenId, txHash) => {
  try {
    const tokenIdBigInt = BigInt(tokenId);
    const result = await pool.query(
      `UPDATE tickets
       SET ticket_id_onchain = $1, token_id = $1, transaction_hash = $2, mint_status = 'SUCCESS', minted_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [tokenIdBigInt, txHash, ticketId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error in updateTicketSuccess service:', error);
    throw error;
  }
};

/**
 * Update a ticket to FAILED status
 * @param {number} ticketId - The database ticket record ID
 * @returns {Promise<Object>} The updated ticket record
 */
const updateTicketFailed = async (ticketId) => {
  try {
    const result = await pool.query(
      `UPDATE tickets
       SET mint_status = 'FAILED'
       WHERE id = $1
       RETURNING *`,
      [ticketId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error in updateTicketFailed service:', error);
    throw error;
  }
};

module.exports = {
  verifyTicket,
  checkInTicket,
  getParticipantTickets,
  createPendingTicket,
  updateTicketSuccess,
  updateTicketFailed,
};
