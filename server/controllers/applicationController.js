import mongoose from 'mongoose';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import Notification from '../models/Notification.js';

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private (Job Seeker)
export const applyForJob = async (req, res, next) => {
  try {
    const { job_id, resume_url, cover_letter } = req.body;

    if (!job_id) {
      return res.status(400).json({ success: false, message: 'Job ID is required.' });
    }

    if (!mongoose.Types.ObjectId.isValid(job_id)) {
      return res.status(400).json({ success: false, message: 'Invalid job ID.' });
    }

    // Check if job exists and is open
    const targetJob = await Job.findById(job_id);
    if (!targetJob) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    // Check if user already applied
    const existingApp = await Application.findOne({ job_id, seeker_id: req.user.id });
    if (existingApp) {
      return res.status(400).json({ success: false, message: 'You have already applied for this job position.' });
    }

    // 1. Submit Application
    const application = await Application.create({
      job_id,
      seeker_id: req.user.id,
      resume_url: resume_url || '',
      cover_letter: cover_letter || '',
    });

    // 2. Mark job as closed so it disappears from public search for other people
    targetJob.status = 'closed';
    await targetJob.save();

    // 3. Send notification to the Employer (Provider)
    const seekerName = req.user.full_name || 'A candidate';
    const notifMessage = `🔔 New Application: ${seekerName} applied for your job listing "${targetJob.title}".`;

    await Notification.create({
      user_id: targetJob.employer_id,
      message: notifMessage,
      type: 'application',
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! The job listing has been filled and reserved for your application.',
      applicationId: application._id.toString(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's submitted applications
// @route   GET /api/applications
// @access  Private (Job Seeker)
export const getMyApplications = async (req, res, next) => {
  try {
    const rawApps = await Application.find({ seeker_id: req.user.id })
      .populate({
        path: 'job_id',
        populate: { path: 'company_id' },
      })
      .sort({ applied_at: -1 });

    const applications = rawApps.map((appDoc) => {
      const app = appDoc.toObject();
      const job = app.job_id && typeof app.job_id === 'object' ? app.job_id : {};
      const company = job.company_id && typeof job.company_id === 'object' ? job.company_id : {};

      return {
        ...app,
        id: app._id.toString(),
        job_id: job._id ? job._id.toString() : app.job_id,
        job_title: job.title || 'Position',
        location: job.location || '',
        job_type: job.job_type || '',
        workplace_type: job.workplace_type || '',
        salary_min: job.salary_min || 0,
        salary_max: job.salary_max || 0,
        company_name: company.company_name || 'Company',
        company_logo: company.logo || '',
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

// @desc    Update application status (Accept / Reject)
// @route   PUT /api/applications/:id
// @access  Private (Employer)
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value. Must be Pending, Accepted, or Rejected.' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid application ID.' });
    }

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      success: true,
      message: `Application status updated to ${status}.`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Withdraw job application
// @route   DELETE /api/applications/:id
// @access  Private (Job Seeker)
export const withdrawApplication = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid application ID.' });
    }

    const application = await Application.findOneAndDelete({ _id: id, seeker_id: req.user.id });
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found or unauthorized.' });
    }

    res.status(200).json({
      success: true,
      message: 'Application withdrawn successfully.',
    });
  } catch (error) {
    next(error);
  }
};
