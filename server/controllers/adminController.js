import mongoose from 'mongoose';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Company from '../models/Company.js';
import Application from '../models/Application.js';

// @desc    Get all users (Admin view)
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = async (req, res, next) => {
  try {
    const rawUsers = await User.find().select('-password_hash').sort({ created_at: -1 });

    const users = rawUsers.map((u) => ({
      ...u.toObject(),
      id: u._id.toString(),
    }));

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs (Admin view)
// @route   GET /api/admin/jobs
// @access  Private (Admin)
export const getAllAdminJobs = async (req, res, next) => {
  try {
    const rawJobs = await Job.find()
      .populate('company_id')
      .populate('employer_id', 'full_name email')
      .sort({ created_at: -1 });

    const jobs = await Promise.all(
      rawJobs.map(async (jobDoc) => {
        const job = jobDoc.toObject();
        const company = job.company_id && typeof job.company_id === 'object' ? job.company_id : {};
        const employer = job.employer_id && typeof job.employer_id === 'object' ? job.employer_id : {};
        const totalApps = await Application.countDocuments({ job_id: job._id });

        return {
          ...job,
          id: job._id.toString(),
          company_name: company.company_name || 'TechCorp',
          employer_name: employer.full_name || 'Employer',
          employer_email: employer.email || '',
          total_applications: totalApps,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete fake or inappropriate job (Admin view)
// @route   DELETE /api/admin/job/:id
// @access  Private (Admin)
export const adminDeleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid job ID.' });
    }

    const job = await Job.findByIdAndDelete(id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Job listing removed by administrator.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user status (Active / Suspended)
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
export const toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Must be active or suspended.' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID.' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.status = status;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User status changed to ${status}.`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get system telemetry / analytics (Admin only)
// @route   GET /api/admin/telemetry
// @access  Private (Admin)
export const getTelemetryData = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    const totalEmployers = await User.countDocuments({ role: 'employer' });
    const totalSeekers = await User.countDocuments({ role: 'job_seeker' });

    // Generate last 7 days trend data
    const trends = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setDate(today.getDate() - i);
      
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      const dateLabel = startOfDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      const [signupsCount, jobsCount, appsCount] = await Promise.all([
        User.countDocuments({ created_at: { $gte: startOfDay, $lte: endOfDay } }),
        Job.countDocuments({ created_at: { $gte: startOfDay, $lte: endOfDay } }),
        Application.countDocuments({ applied_at: { $gte: startOfDay, $lte: endOfDay } }),
      ]);

      trends.push({
        date: dateLabel,
        signups: signupsCount,
        jobs: jobsCount,
        applications: appsCount,
      });
    }

    res.status(200).json({
      success: true,
      metrics: {
        totalUsers,
        totalJobs,
        totalApplications,
        totalEmployers,
        totalSeekers,
      },
      trends,
    });
  } catch (error) {
    next(error);
  }
};
