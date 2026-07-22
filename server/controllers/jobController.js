import mongoose from 'mongoose';
import Job from '../models/Job.js';
import Company from '../models/Company.js';
import Category from '../models/Category.js';
import User from '../models/User.js';

// Helper to format job object with company and category fields for frontend compatibility
const formatJob = (jobDoc) => {
  const job = jobDoc.toObject ? jobDoc.toObject() : jobDoc;
  const company = job.company_id && typeof job.company_id === 'object' ? job.company_id : {};
  const category = job.category_id && typeof job.category_id === 'object' ? job.category_id : {};
  const employer = job.employer_id && typeof job.employer_id === 'object' ? job.employer_id : {};

  return {
    ...job,
    id: job._id ? job._id.toString() : job.id,
    company_id: company._id ? company._id.toString() : job.company_id,
    category_id: category._id ? category._id.toString() : job.category_id,
    employer_id: employer._id ? employer._id.toString() : job.employer_id,
    company_name: company.company_name || 'TechCorp Systems',
    company_logo: company.logo || '',
    company_website: company.website || '',
    company_location: company.location || '',
    company_description: company.description || '',
    company_industry: company.industry || '',
    average_rating: company.average_rating || 0,
    reviews_count: company.reviews_count || 0,
    category_name: category.name || 'General',
    category_slug: category.slug || 'general',
    employer_name: employer.full_name || '',
    employer_email: employer.email || '',
  };
};

// @desc    Get all jobs with search and filters
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res, next) => {
  try {
    const { keyword, location, category, job_type, workplace_type, experience_level, min_salary, page = 1, limit = 10 } = req.query;

    const rawJobs = await Job.find({ status: 'open' })
      .populate('company_id')
      .populate('category_id')
      .populate('employer_id', 'full_name email')
      .sort({ created_at: -1 });

    let filtered = rawJobs.map(formatJob);

    if (keyword) {
      const q = keyword.toLowerCase();
      filtered = filtered.filter(
        j => j.title.toLowerCase().includes(q) || j.description.toLowerCase().includes(q) || (j.company_name && j.company_name.toLowerCase().includes(q))
      );
    }

    if (location) {
      const loc = location.toLowerCase();
      filtered = filtered.filter(j => j.location.toLowerCase().includes(loc));
    }

    if (category) {
      filtered = filtered.filter(j => j.category_id === category || j.category_slug === category);
    }

    if (job_type) {
      filtered = filtered.filter(j => j.job_type === job_type);
    }

    if (workplace_type) {
      filtered = filtered.filter(j => j.workplace_type === workplace_type);
    }

    if (experience_level) {
      filtered = filtered.filter(j => j.experience_level === experience_level);
    }

    if (min_salary) {
      filtered = filtered.filter(j => (j.salary_max || j.salary_min || 0) >= parseFloat(min_salary));
    }

    // Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / limitNum) || 1;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedJobs = filtered.slice(startIndex, startIndex + limitNum);

    res.status(200).json({
      success: true,
      count: paginatedJobs.length,
      totalCount,
      totalPages,
      currentPage: pageNum,
      jobs: paginatedJobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid job ID format.' });
    }

    const jobDoc = await Job.findById(id)
      .populate('company_id')
      .populate('category_id')
      .populate('employer_id', 'full_name email');

    if (!jobDoc) {
      return res.status(404).json({ success: false, message: 'Job listing not found.' });
    }

    res.status(200).json({
      success: true,
      job: formatJob(jobDoc),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new job posting
// @route   POST /api/jobs
// @access  Private (Employer)
export const createJob = async (req, res, next) => {
  try {
    const {
      title,
      category_id,
      category_name,
      description,
      requirements,
      job_type,
      workplace_type,
      location,
      salary_min,
      salary_max,
      experience_level,
    } = req.body;

    const rawCategory = category_name || category_id;

    if (!title || !rawCategory || !description || !job_type || !location) {
      return res.status(400).json({ success: false, message: 'Please provide job title, category, description, job type, and location.' });
    }

    // Dynamic Category Resolution
    let finalCategory = null;

    if (mongoose.Types.ObjectId.isValid(rawCategory)) {
      finalCategory = await Category.findById(rawCategory);
    }

    if (!finalCategory) {
      const catNameStr = String(rawCategory).trim();
      const catSlug = catNameStr.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      finalCategory = await Category.findOne({ $or: [{ slug: catSlug }, { name: catNameStr }] });

      if (!finalCategory) {
        finalCategory = await Category.create({
          name: catNameStr,
          slug: catSlug || `cat-${Date.now()}`,
          description: 'Category created by employer',
        });
      }
    }

    // Get company for employer
    let company = await Company.findOne({ user_id: req.user.id });
    if (!company) {
      company = await Company.create({
        user_id: req.user.id,
        company_name: `${req.user.full_name}'s Enterprise`,
        location: location || 'Remote',
      });
    }

    const job = await Job.create({
      employer_id: req.user.id,
      company_id: company._id,
      category_id: finalCategory._id,
      title,
      description,
      requirements: requirements || '',
      job_type,
      workplace_type: workplace_type || 'On-Site',
      location,
      salary_min: salary_min ? parseFloat(salary_min) : 0,
      salary_max: salary_max ? parseFloat(salary_max) : 0,
      experience_level: experience_level || 'Mid',
      status: 'open',
    });

    res.status(201).json({
      success: true,
      message: 'Job posted successfully!',
      jobId: job._id.toString(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update existing job
// @route   PUT /api/jobs/:id
// @access  Private (Employer/Admin)
export const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid job ID format.' });
    }

    const existingJob = await Job.findById(id);
    if (!existingJob) {
      return res.status(404).json({ success: false, message: 'Job listing not found.' });
    }

    if (existingJob.employer_id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this job.' });
    }

    const {
      title,
      category_id,
      description,
      requirements,
      job_type,
      workplace_type,
      location,
      salary_min,
      salary_max,
      experience_level,
      status,
    } = req.body;

    if (title) existingJob.title = title;
    if (category_id && mongoose.Types.ObjectId.isValid(category_id)) existingJob.category_id = category_id;
    if (description) existingJob.description = description;
    if (requirements !== undefined) existingJob.requirements = requirements;
    if (job_type) existingJob.job_type = job_type;
    if (workplace_type) existingJob.workplace_type = workplace_type;
    if (location) existingJob.location = location;
    if (salary_min !== undefined) existingJob.salary_min = parseFloat(salary_min);
    if (salary_max !== undefined) existingJob.salary_max = parseFloat(salary_max);
    if (experience_level) existingJob.experience_level = experience_level;
    if (status) existingJob.status = status;

    await existingJob.save();

    res.status(200).json({
      success: true,
      message: 'Job listing updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Employer/Admin)
export const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid job ID format.' });
    }

    const existingJob = await Job.findById(id);
    if (!existingJob) {
      return res.status(404).json({ success: false, message: 'Job listing not found.' });
    }

    if (existingJob.employer_id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this job.' });
    }

    await Job.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Job listing deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
