const {
  checkInTicket,
  getParticipantTickets,
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
  console.log('[Purchase Flow] Step 1: Validating purchase request...');
  try {
    const participantId = req.user.id;
    const { eventId } = req.body;

    if (!eventId) {
      console.log('[Purchase Flow] Validation Failed: Event ID is required');
      return res.status(400).json({
        success: false,
        message: 'Event ID is required',
      });
    }

    // 1. Fetch user & check wallet connection and verification
    const user = await getUserById(participantId);
    if (!user.wallet_address) {
      console.log('[Purchase Flow] Validation Failed: Wallet not connected');
      return res.status(400).json({
        success: false,
        message: 'Wallet belum terhubung. Silakan hubungkan wallet Anda terlebih dahulu.',
      });
    }

    if (!user.wallet_verified) {
      console.log('[Purchase Flow] Validation Failed: Wallet not verified');
      return res.status(400).json({
        success: false,
        message: 'Wallet belum diverifikasi. Silakan lakukan Wallet Verification terlebih dahulu.',
      });
    }

    // 2. Fetch event details & check quota and status
    const event = await getEventById(eventId);
    if (!event) {
      console.log(`[Purchase Flow] Validation Failed: Event with ID ${eventId} not found`);
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    if (event.status !== 'published') {
      console.log(`[Purchase Flow] Validation Failed: Event status is ${event.status}, expected published`);
      return res.status(400).json({
        success: false,
        message: 'Event is not published',
      });
    }

    const ticketsSold = event.tickets_sold || 0;
    if (ticketsSold >= event.quota) {
      console.log(`[Purchase Flow] Validation Failed: Event is sold out (${ticketsSold}/${event.quota})`);
      return res.status(400).json({
        success: false,
        message: 'Ticket Sold Out',
      });
    }

    // Check if user already purchased a ticket for this event (one ticket per user limit)
    const existingTicket = await pool.query(
      `SELECT id FROM tickets 
       WHERE participant_id = $1 AND event_id = $2 AND mint_status = 'SUCCESS'`,
      [participantId, eventId]
    );
    if (existingTicket.rows.length > 0) {
      console.log('[Purchase Flow] Validation Failed: User already has a ticket for this event');
      return res.status(400).json({
        success: false,
        message: 'Anda sudah membeli tiket untuk event ini.',
      });
    }

    // 2. Trigger blockchain minting
    console.log(`[Purchase Flow] Step 2: Minting NFT on blockchain for wallet: ${user.wallet_address}, eventId: ${eventId}`);
    const mintResult = await mintTicket(user.wallet_address, { eventId });
    console.log(`[Purchase Flow] Blockchain Mint Succeeded. Token ID: ${mintResult.tokenId}, Tx Hash: ${mintResult.txHash}`);

    // 3. Simpan data ticket & Commit transaction
    console.log('[Purchase Flow] Step 3: Acquiring database client from pool...');
    const client = await pool.connect();
    
    let updatedTicket = null;
    try {
      console.log('[Purchase Flow] Step 3.1: Beginning database transaction...');
      await client.query('BEGIN');

      // Re-validate inside transaction (lock event row to prevent quota race condition)
      console.log('[Purchase Flow] Step 3.2: Re-validating event quota with row lock...');
      const eventLockRes = await client.query(
        'SELECT quota, tickets_sold FROM events WHERE id = $1 FOR UPDATE',
        [eventId]
      );
      if (eventLockRes.rows.length === 0) {
        throw new Error('Event not found');
      }
      const lockedEvent = eventLockRes.rows[0];
      const lockedTicketsSold = lockedEvent.tickets_sold || 0;
      if (lockedTicketsSold >= lockedEvent.quota) {
        throw new Error('Ticket Sold Out');
      }

      // Re-validate double purchase inside transaction to prevent race conditions
      console.log('[Purchase Flow] Step 3.3: Re-validating existing tickets with lock...');
      const ticketLockRes = await client.query(
        'SELECT id FROM tickets WHERE participant_id = $1 AND event_id = $2 AND mint_status = \'SUCCESS\' FOR UPDATE',
        [participantId, eventId]
      );
      if (ticketLockRes.rows.length > 0) {
        throw new Error('Anda sudah membeli tiket untuk event ini.');
      }

      console.log('[Purchase Flow] Step 3.4: Inserting ticket record as SUCCESS into database...');
      const tokenIdBigInt = BigInt(mintResult.tokenId);
      const insertTicketQuery = `
        INSERT INTO tickets (
          participant_id, user_id, event_id, owner_wallet, wallet_address, 
          ticket_id_onchain, token_id, transaction_hash, mint_status, status, minted_at
        )
        VALUES ($1, $1, $2, $3, $3, $4, $4, $5, 'SUCCESS', 'active', NOW())
        RETURNING *
      `;
      const ticketRes = await client.query(insertTicketQuery, [
        participantId,
        eventId,
        user.wallet_address,
        tokenIdBigInt,
        mintResult.txHash
      ]);
      updatedTicket = ticketRes.rows[0];

      console.log('[Purchase Flow] Step 3.5: Incrementing event tickets_sold...');
      await client.query(
        'UPDATE events SET tickets_sold = tickets_sold + 1 WHERE id = $1',
        [eventId]
      );

      console.log('[Purchase Flow] Step 4: Committing database transaction...');
      await client.query('COMMIT');
      console.log('[Purchase Flow] Database transaction successfully committed.');

    } catch (transactionError) {
      console.error('[Purchase Flow] Error in database transaction. Initiating ROLLBACK...', transactionError);
      try {
        await client.query('ROLLBACK');
        console.log('[Purchase Flow] Database transaction rollback completed.');
      } catch (rollbackErr) {
        console.error('[Purchase Flow] Failed to rollback database transaction:', rollbackErr);
      }
      throw transactionError;
    } finally {
      client.release();
    }

    console.log('[Purchase Flow] Step 5: Returning successful response.');
    return res.status(200).json({
      success: true,
      message: 'NFT Minted Successfully',
      data: {
        tokenId: updatedTicket.token_id ? updatedTicket.token_id.toString() : mintResult.tokenId,
        ticketIdOnchain: updatedTicket.ticket_id_onchain ? updatedTicket.ticket_id_onchain.toString() : mintResult.tokenId,
        transactionHash: updatedTicket.transaction_hash,
        mintedAt: updatedTicket.minted_at,
      },
    });

  } catch (error) {
    console.error('[Purchase Flow] Purchase process failed. Error:', error);

    const badRequestErrors = ['Anda sudah membeli tiket untuk event ini.', 'Ticket Sold Out', 'Event not found'];
    if (badRequestErrors.includes(error.message)) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: 'NFT gagal dibuat. Silakan coba beberapa saat lagi.',
    });
  }
};

module.exports = { verify, checkIn, getMyTickets, purchase };
