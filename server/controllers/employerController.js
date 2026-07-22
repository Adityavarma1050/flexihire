import mongoose from 'mongoose';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Company from '../models/Company.js';
import Notification from '../models/Notification.js';

// @desc    Get all jobs posted by current employer
// @route   GET /api/employer/jobs
// @access  Private (Employer)
export const getEmployerJobs = async (req, res, next) => {
  try {
    const rawJobs = await Job.find({ employer_id: req.user.id }).sort({ created_at: -1 });

    const jobsWithCount = await Promise.all(
      rawJobs.map(async (jobDoc) => {
        const job = jobDoc.toObject();
        const appCount = await Application.countDocuments({ job_id: job._id });
        return {
          ...job,
          id: job._id.toString(),
          application_count: appCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: jobsWithCount.length,
      jobs: jobsWithCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications received for employer's jobs
// @route   GET /api/employer/applications
// @access  Private (Employer)
export const getEmployerApplications = async (req, res, next) => {
  try {
    const employerJobs = await Job.find({ employer_id: req.user.id });
    const jobIds = employerJobs.map((j) => j._id);

    const rawApps = await Application.find({ job_id: { $in: jobIds } })
      .populate('job_id')
      .populate('seeker_id', 'full_name email phone bio avatar')
      .sort({ applied_at: -1 });

    const applications = rawApps.map((appDoc) => {
      const app = appDoc.toObject();
      const job = app.job_id && typeof app.job_id === 'object' ? app.job_id : {};
      const seeker = app.seeker_id && typeof app.seeker_id === 'object' ? app.seeker_id : {};

      return {
        ...app,
        id: app._id.toString(),
        job_id: job._id ? job._id.toString() : app.job_id,
        job_title: job.title || 'Job Listing',
        job_location: job.location || '',
        job_type: job.job_type || '',
        seeker_id: seeker._id ? seeker._id.toString() : app.seeker_id,
        seeker_name: seeker.full_name || 'Candidate',
        seeker_email: seeker.email || '',
        seeker_phone: seeker.phone || '',
        seeker_bio: seeker.bio || '',
        seeker_avatar: seeker.avatar || '',
      };
    });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update employer's company profile
// @route   PUT /api/employer/company
// @access  Private (Employer)
export const updateCompanyProfile = async (req, res, next) => {
  try {
    const { company_name, logo, website, location, description, industry } = req.body;

    const company = await Company.findOneAndUpdate(
      { user_id: req.user.id },
      {
        company_name,
        logo,
        website,
        location,
        description,
        industry,
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Company profile updated successfully!',
      company: {
        ...company.toObject(),
        id: company._id.toString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get notifications for employer
// @route   GET /api/employer/notifications
// @access  Private (Employer)
export const getEmployerNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user_id: req.user.id }).sort({ created_at: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications: notifications.map((n) => ({
        ...n.toObject(),
        id: n._id.toString(),
      })),
    });
  } catch (error) {
    next(error);
  }
};
