import express from 'express';
import { 
  getAllUsers, 
  getAllAdminJobs, 
  adminDeleteJob, 
  toggleUserStatus,
  getTelemetryData 
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.get('/jobs', getAllAdminJobs);
router.delete('/job/:id', adminDeleteJob);
router.put('/users/:id/status', toggleUserStatus);
router.get('/telemetry', getTelemetryData);

export default router;
