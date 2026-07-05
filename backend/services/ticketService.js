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

module.exports = {
  verifyTicket,
  checkInTicket,
};
