import express from 'express';
import { saveJob, getSavedJobs, removeSavedJob } from '../controllers/savedJobController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('job_seeker'), saveJob);
router.get('/', protect, authorize('job_seeker'), getSavedJobs);
router.delete('/:id', protect, authorize('job_seeker'), removeSavedJob);

export default router;
