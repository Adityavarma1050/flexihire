import express from 'express';
import { 
  createSupportTicket, 
  getSupportTickets, 
  getTicketDetails, 
  sendSupportMessage, 
  updateTicketStatus 
} from '../controllers/supportController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/tickets', createSupportTicket);
router.get('/tickets', getSupportTickets);
router.get('/tickets/:id', getTicketDetails);
router.post('/tickets/:id/messages', sendSupportMessage);
router.put('/tickets/:id/status', authorize('admin'), updateTicketStatus);

export default router;
