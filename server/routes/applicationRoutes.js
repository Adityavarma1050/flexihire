import express from 'express';
import { applyForJob, getMyApplications, updateApplicationStatus, withdrawApplication } from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('job_seeker'), applyForJob);
router.get('/', protect, authorize('job_seeker'), getMyApplications);
router.put('/:id', protect, authorize('employer', 'admin'), updateApplicationStatus);
router.delete('/:id', protect, authorize('job_seeker'), withdrawApplication);

export default router;
