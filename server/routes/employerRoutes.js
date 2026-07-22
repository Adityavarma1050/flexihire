import express from 'express';
import { getEmployerJobs, getEmployerApplications, updateCompanyProfile, getEmployerNotifications } from '../controllers/employerController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/jobs', protect, authorize('employer', 'admin'), getEmployerJobs);
router.get('/applications', protect, authorize('employer', 'admin'), getEmployerApplications);
router.get('/notifications', protect, authorize('employer', 'admin'), getEmployerNotifications);
router.put('/company', protect, authorize('employer', 'admin'), updateCompanyProfile);

export default router;
