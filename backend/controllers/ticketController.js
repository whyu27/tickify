const { verifyTicket, checkInTicket } = require('../services/ticketService');

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
    const result = await verifyTicket(ticketIdOnChain, organizerId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Verify ticket error:', error);
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

module.exports = { verify, checkIn };
