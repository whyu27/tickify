const {
  verifyTicket,
  checkInTicket,
  getParticipantTickets,
  createPendingTicket,
  updateTicketSuccess,
  updateTicketFailed,
  verifyTicketAndCheckIn
} = require('../services/ticketService');
const { getUserById } = require('../services/authService');
const { getEventById } = require('../services/eventService');
const { mintTicket } = require('../services/blockchain.service');
const { pool } = require('../config/database');

const verify = async (req, res) => {
  try {
    const { ticketIdOnChain } = req.body;

    // Validation
    if (!ticketIdOnChain) {
      return res.status(400).json({
        success: false,
        message: 'Ticket ID is required',
      });
    }

    const ticketIdNumber = Number(ticketIdOnChain);
    if (isNaN(ticketIdNumber) || ticketIdNumber <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Ticket ID must be a valid positive number',
      });
    }

    const organizerId = req.user.id;
    const result = await verifyTicketAndCheckIn(ticketIdNumber, organizerId);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Verify ticket error:', error);
    
    // Check for known errors and return with success: false and reason
    const knownErrors = ['Ticket not found', 'Ticket cancelled', 'NFT not found', 'Owner mismatch'];
    if (knownErrors.includes(error.message)) {
      return res.status(200).json({
        success: false,
        reason: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to verify ticket',
    });
  }
};

const checkIn = async (req, res) => {
  try {
    const { ticketIdOnChain } = req.body;

    // Validation
    if (!ticketIdOnChain) {
      return res.status(400).json({
        success: false,
        message: 'Ticket ID is required',
      });
    }

    const ticketIdNumber = Number(ticketIdOnChain);
    if (isNaN(ticketIdNumber) || ticketIdNumber <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Ticket ID must be a valid positive number',
      });
    }

    const organizerId = req.user.id;
    const result = await checkInTicket(ticketIdOnChain, organizerId);

    return res.status(200).json({
      success: true,
      message: 'Ticket checked in successfully',
      data: result,
    });
  } catch (error) {
    console.error('Check-in ticket error:', error);
    
    // Handle specific business logic errors
    if (error.message === 'Ticket already used') {
      return res.status(400).json({
        success: false,
        message: 'Ticket has already been used',
      });
    }
    
    if (error.message === 'Ticket not found or unauthorized') {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found or you are not authorized to check in this ticket',
      });
    }

    if (error.message === 'Ticket is not active') {
      return res.status(400).json({
        success: false,
        message: 'Ticket is not in active status',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to check in ticket',
    });
  }
};

const getMyTickets = async (req, res) => {
  try {
    const participantId = req.user.id;
    const tickets = await getParticipantTickets(participantId);

    return res.status(200).json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    console.error('Get my tickets error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve tickets',
    });
  }
};

const purchase = async (req, res) => {
  let createdTicket = null;
  try {
    const participantId = req.user.id;
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: 'Event ID is required',
      });
    }

    // 1. Fetch user & check wallet connection and verification
    const user = await getUserById(participantId);
    if (!user.wallet_address) {
      return res.status(400).json({
        success: false,
        message: 'Wallet belum terhubung. Silakan hubungkan wallet Anda terlebih dahulu.',
      });
    }

    if (!user.wallet_verified) {
      return res.status(400).json({
        success: false,
        message: 'Wallet belum diverifikasi. Silakan lakukan Wallet Verification terlebih dahulu.',
      });
    }

    // 2. Fetch event details & check quota and status
    const event = await getEventById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    if (event.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'Event is not published',
      });
    }

    const ticketsSold = event.tickets_sold || 0;
    if (ticketsSold >= event.quota) {
      return res.status(400).json({
        success: false,
        message: 'Ticket Sold Out',
      });
    }

    // Check if user already purchased a ticket for this event (one ticket per user limit)
    const existingTicket = await pool.query(
      `SELECT id FROM tickets 
       WHERE participant_id = $1 AND event_id = $2 AND (mint_status = 'SUCCESS' OR mint_status = 'PENDING')`,
      [participantId, eventId]
    );
    if (existingTicket.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Anda sudah membeli tiket untuk event ini.',
      });
    }

    // 3. Write PENDING ticket record to database
    createdTicket = await createPendingTicket(participantId, eventId, user.wallet_address);

    // 4. Trigger blockchain minting
    console.log(`Starting blockchain mint for ticket ID: ${createdTicket.id}`);
    const mintResult = await mintTicket(user.wallet_address, { eventId });

    // 5. Update ticket on SUCCESS
    const updatedTicket = await updateTicketSuccess(createdTicket.id, mintResult.tokenId, mintResult.txHash);

    // 6. Update event sold tickets count
    await pool.query(
      'UPDATE events SET tickets_sold = tickets_sold + 1 WHERE id = $1',
      [eventId]
    );

    return res.status(200).json({
      success: true,
      message: 'NFT Minted Successfully',
      data: {
        tokenId: updatedTicket.token_id,
        ticketIdOnchain: updatedTicket.ticket_id_onchain,
        transactionHash: updatedTicket.transaction_hash,
        mintedAt: updatedTicket.minted_at,
      },
    });

  } catch (error) {
    console.error('Purchase ticket error:', error);

    // If ticket was created and blockchain call failed, update status to FAILED
    if (createdTicket && createdTicket.id) {
      try {
        await updateTicketFailed(createdTicket.id);
      } catch (dbErr) {
        console.error('Failed to update ticket status to FAILED in catch block:', dbErr);
      }
    }

    return res.status(500).json({
      success: false,
      message: 'NFT gagal dibuat. Silakan coba beberapa saat lagi.',
    });
  }
};

module.exports = { verify, checkIn, getMyTickets, purchase };
