const { pool } = require('../config/database');
const { getNFTOwner, checkInNFTOnChain } = require('./blockchain.service');

/**
 * Verify a ticket, validate it on blockchain, and check it in automatically if valid
 * @param {string|number} ticketIdOnChain - The on-chain ticket ID (tokenId)
 * @param {number} organizerId - The organizer's user ID
 * @returns {Object} Verification and check-in result
 */
const verifyTicketAndCheckIn = async (ticketIdOnChain, organizerId) => {
  try {
    // 1. Cari ticket di database
    const query = `
      SELECT 
        t.id,
        t.token_id,
        t.ticket_id_onchain,
        t.status,
        t.mint_status,
        t.wallet_address,
        t.owner_wallet,
        t.used_at,
        e.id as event_id,
        e.title as event_name,
        e.organizer_id
      FROM tickets t
      JOIN events e ON t.event_id = e.id
      WHERE t.token_id = $1 OR t.ticket_id_onchain = $1
    `;

    const result = await pool.query(query, [ticketIdOnChain]);

    // Jika tidak ada -> Ticket Not Found
    if (result.rows.length === 0) {
      throw new Error('Ticket not found');
    }

    const ticket = result.rows[0];

    // 2. Validasi Database
    // Pastikan status tidak FAILED
    if (ticket.mint_status === 'FAILED') {
      throw new Error('Ticket cancelled');
    }

    // Event sesuai (Organizer owns this event)
    if (ticket.organizer_id !== organizerId) {
      throw new Error('Ticket not found'); // Use 'Ticket not found' for unauthorized event
    }

    // Belum pernah digunakan. Jika ticket sudah digunakan -> Ticket Already Used
    if (ticket.status === 'used') {
      return {
        success: true,
        status: 'used',
        usedAt: ticket.used_at,
        ticket: {
          ticketId: ticket.token_id || ticket.ticket_id_onchain,
          eventName: ticket.event_name,
          walletAddress: ticket.wallet_address || ticket.owner_wallet,
        }
      };
    }

    // 3. Validasi Blockchain
    let nftOwner;
    try {
      nftOwner = await getNFTOwner(ticketIdOnChain);
    } catch (error) {
      console.error('Error fetching NFT owner from blockchain:', error);
      // Jika token tidak ada -> NFT does not exist
      throw new Error('NFT not found');
    }

    // owner sesuai dengan wallet_address di database
    const dbWallet = (ticket.wallet_address || ticket.owner_wallet || '').toLowerCase();
    if (!nftOwner || nftOwner.toLowerCase() !== dbWallet) {
      throw new Error('Owner mismatch');
    }

    // 4. Check-in
    // Jika smart contract sudah memiliki fungsi check-in, panggil juga fungsi tersebut.
    let txHash = null;
    try {
      txHash = await checkInNFTOnChain(ticketIdOnChain);
    } catch (error) {
      console.error('Error calling checkIn on blockchain contract:', error);
      // Proceed even if contract call reverts (e.g. already checked in on chain but not DB)
    }

    // Update database: ticket.status = USED, checked_in_at = current_timestamp (used_at)
    const updateQuery = `
      UPDATE tickets
      SET 
        status = 'used',
        used_at = NOW(),
        verified_by = $1
      WHERE id = $2 AND status = 'active'
      RETURNING *
    `;
    const updateResult = await pool.query(updateQuery, [organizerId, ticket.id]);

    if (updateResult.rows.length === 0) {
      throw new Error('Failed to update ticket status in database');
    }

    const updatedTicket = updateResult.rows[0];

    return {
      success: true,
      status: 'valid',
      ticket: {
        ticketId: updatedTicket.token_id || updatedTicket.ticket_id_onchain,
        eventName: ticket.event_name,
        walletAddress: updatedTicket.wallet_address || updatedTicket.owner_wallet,
        status: 'Active', // Rendered as Active in valid card
        blockchainVerified: true,
        checkInSuccessful: true,
        txHash: txHash
      }
    };
  } catch (error) {
    console.error('Error in verifyTicketAndCheckIn service:', error);
    throw error;
  }
};

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

module.exports = {
  verifyTicket,
  checkInTicket,
  getParticipantTickets,
  verifyTicketAndCheckIn
};
