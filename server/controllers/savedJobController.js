import mongoose from 'mongoose';
import SavedJob from '../models/SavedJob.js';

// @desc    Save/Bookmark a job
// @route   POST /api/saved
// @access  Private (Job Seeker)
export const saveJob = async (req, res, next) => {
  try {
    const { job_id } = req.body;

    if (!job_id) {
      return res.status(400).json({ success: false, message: 'Job ID is required.' });
    }

    if (!mongoose.Types.ObjectId.isValid(job_id)) {
      return res.status(400).json({ success: false, message: 'Invalid job ID format.' });
    }

    const existing = await SavedJob.findOne({ seeker_id: req.user.id, job_id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Job is already saved in your bookmarks.' });
    }

    await SavedJob.create({ seeker_id: req.user.id, job_id });

    res.status(201).json({
      success: true,
      message: 'Job saved to your bookmarks!',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all saved jobs for user
// @route   GET /api/saved
// @access  Private (Job Seeker)
export const getSavedJobs = async (req, res, next) => {
  try {
    const rawSaved = await SavedJob.find({ seeker_id: req.user.id })
      .populate({
        path: 'job_id',
        populate: { path: 'company_id' },
      })
      .sort({ saved_at: -1 });

    const savedJobs = rawSaved
      .filter((s) => s.job_id) // Filter out deleted jobs
      .map((savedDoc) => {
        const saved = savedDoc.toObject();
        const job = saved.job_id && typeof saved.job_id === 'object' ? saved.job_id : {};
        const company = job.company_id && typeof job.company_id === 'object' ? job.company_id : {};

        return {
          ...job,
          id: job._id ? job._id.toString() : job.id,
          saved_id: saved._id.toString(),
          saved_at: saved.saved_at,
          company_name: company.company_name || '',
          company_logo: company.logo || '',
        };
      });

    res.status(200).json({
      success: true,
      count: savedJobs.length,
      savedJobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove saved job bookmark
// @route   DELETE /api/saved/:id
// @access  Private (Job Seeker)
export const removeSavedJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    const queryConditions = { seeker_id: req.user.id };

    if (mongoose.Types.ObjectId.isValid(id)) {
      queryConditions.$or = [{ _id: id }, { job_id: id }];
    } else {
      queryConditions.job_id = id;
    }

    await SavedJob.deleteMany(queryConditions);

    res.status(200).json({
      success: true,
      message: 'Job removed from saved bookmarks.',
    });
  } catch (error) {
    next(error);
  }
};
