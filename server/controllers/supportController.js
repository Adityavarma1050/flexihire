import mongoose from 'mongoose';
import SupportTicket from '../models/SupportTicket.js';
import SupportMessage from '../models/SupportMessage.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

// @desc    Raise a new Support Ticket
// @route   POST /api/support/tickets
// @access  Private (Job Seeker / Employer)
export const createSupportTicket = async (req, res, next) => {
  try {
    const { subject, category, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ success: false, message: 'Please provide a subject and detailed description message.' });
    }

    const ticket = await SupportTicket.create({
      user_id: req.user.id,
      subject,
      category: category || 'General Inquiry',
    });

    // Add initial message thread
    await SupportMessage.create({
      ticket_id: ticket._id,
      sender_id: req.user.id,
      message,
    });

    // Create notifications for admins
    const adminUsers = await User.find({ role: 'admin' });
    const notifMessage = `📩 New Support Ticket raised by ${req.user.full_name}: "${subject}"`;

    await Promise.all(
      adminUsers.map((admin) =>
        Notification.create({
          user_id: admin._id,
          message: notifMessage,
          type: 'support',
        })
      )
    );

    res.status(201).json({
      success: true,
      message: 'Support ticket raised successfully! An admin will review and respond shortly.',
      ticketId: ticket._id.toString(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get support tickets (User's own tickets OR all tickets if Admin)
// @route   GET /api/support/tickets
// @access  Private
export const getSupportTickets = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { user_id: req.user.id };

    const rawTickets = await SupportTicket.find(filter)
      .populate('user_id', 'full_name email role')
      .sort({ updated_at: -1 });

    const tickets = await Promise.all(
      rawTickets.map(async (tDoc) => {
        const ticket = tDoc.toObject();
        const user = ticket.user_id && typeof ticket.user_id === 'object' ? ticket.user_id : {};
        const totalMessages = await SupportMessage.countDocuments({ ticket_id: ticket._id });

        return {
          ...ticket,
          id: ticket._id.toString(),
          user_id: user._id ? user._id.toString() : ticket.user_id,
          user_name: user.full_name || 'User',
          user_email: user.email || '',
          user_role: user.role || 'job_seeker',
          total_messages: totalMessages,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single support ticket with chat message history
// @route   GET /api/support/tickets/:id
// @access  Private
export const getTicketDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ticket ID.' });
    }

    const tDoc = await SupportTicket.findById(id).populate('user_id', 'full_name email role');
    if (!tDoc) {
      return res.status(404).json({ success: false, message: 'Support ticket not found.' });
    }

    const ticket = tDoc.toObject();
    const user = ticket.user_id && typeof ticket.user_id === 'object' ? ticket.user_id : {};

    if (user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this support ticket.' });
    }

    const rawMessages = await SupportMessage.find({ ticket_id: ticket._id })
      .populate('sender_id', 'full_name role')
      .sort({ created_at: 1 });

    const messages = rawMessages.map((mDoc) => {
      const msg = mDoc.toObject();
      const sender = msg.sender_id && typeof msg.sender_id === 'object' ? msg.sender_id : {};

      return {
        ...msg,
        id: msg._id.toString(),
        sender_id: sender._id ? sender._id.toString() : msg.sender_id,
        sender_name: sender.full_name || 'User',
        sender_role: sender.role || 'job_seeker',
      };
    });

    res.status(200).json({
      success: true,
      ticket: {
        ...ticket,
        id: ticket._id.toString(),
        user_name: user.full_name || 'User',
        user_email: user.email || '',
        user_role: user.role || 'job_seeker',
      },
      messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Post reply message to ticket chat thread
// @route   POST /api/support/tickets/:id/messages
// @access  Private
export const sendSupportMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message content is required.' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ticket ID.' });
    }

    const ticket = await SupportTicket.findById(id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Support ticket not found.' });
    }

    if (ticket.user_id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to reply to this ticket.' });
    }

    await SupportMessage.create({
      ticket_id: ticket._id,
      sender_id: req.user.id,
      message,
    });

    ticket.status = req.user.role === 'admin' ? 'In Progress' : 'Open';
    await ticket.save();

    if (req.user.role === 'admin') {
      await Notification.create({
        user_id: ticket.user_id,
        message: `💬 Admin replied to your Support Ticket: "${ticket.subject}"`,
        type: 'support',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Support message sent successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update ticket status (Admin)
// @route   PUT /api/support/tickets/:id/status
// @access  Private (Admin)
export const updateTicketStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Open', 'In Progress', 'Resolved'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Must be Open, In Progress, or Resolved.' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ticket ID.' });
    }

    const ticket = await SupportTicket.findById(id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Support ticket not found.' });
    }

    ticket.status = status;
    await ticket.save();

    res.status(200).json({
      success: true,
      message: `Support ticket status updated to ${status}.`,
    });
  } catch (error) {
    next(error);
  }
};
