import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import API from '../services/api';
import { Briefcase, MapPin, DollarSign, Send, FileText, Plus } from 'lucide-react';

export default function PostJobPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [jobType, setJobType] = useState('Full-Time');
  const [workplaceType, setWorkplaceType] = useState('On-Site');
  const [location, setLocation] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [salaryPeriod, setSalaryPeriod] = useState('yearly');
  const [experienceLevel, setExperienceLevel] = useState('Mid');

  useEffect(() => {
    API.get('/categories').then((res) => {
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !categoryInput.trim() || !description || !location) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await API.post('/jobs', {
        title,
        category_name: categoryInput.trim(),
        description,
        requirements,
        job_type: jobType,
        workplace_type: workplaceType,
        location,
        salary_min: salaryMin ? parseFloat(salaryMin) : null,
        salary_max: salaryMax ? parseFloat(salaryMax) : null,
        salary_period: salaryPeriod,
        experience_level: experienceLevel,
      });

      if (res.data.success) {
        showToast('Job listing published successfully!', 'success');
        navigate('/employer/manage-jobs');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to post job listing.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-2">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Post a New Job Opportunity</h1>
        <p className="text-sm font-semibold text-slate-500">Create a custom job listing to receive applications from qualified candidates</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Job Title & Category Input */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Job Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Full Stack Engineer"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Job Category / Industry *
            </label>
            <div className="space-y-2">
              <input
                type="text"
                required
                list="category-suggestions"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                placeholder="Type or select category (e.g. Software, Healthcare, Design)"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white"
              />
              <datalist id="category-suggestions">
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name} />
                ))}
              </datalist>
              <p className="text-[11px] text-slate-400">Type any category name or choose from common suggestions</p>
            </div>
          </div>
        </div>

        {/* Job Type & Workplace Model */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Job Type *
            </label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white"
            >
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Internship">Internship</option>
              <option value="Freelance">Freelance</option>
              <option value="Temporary">Temporary</option>
              <option value="Weekend">Weekend</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Workplace Model *
            </label>
            <select
              value={workplaceType}
              onChange={(e) => setWorkplaceType(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white"
            >
              <option value="On-Site">On-Site</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Experience Level
            </label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white"
            >
              <option value="Entry">Entry Level</option>
              <option value="Mid">Mid Level</option>
              <option value="Senior">Senior Level</option>
              <option value="Executive">Executive</option>
            </select>
          </div>
        </div>

        {/* Location & Salary Range */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Location *
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. San Francisco, CA or Remote"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Min Salary ($)
            </label>
            <input
              type="number"
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
              placeholder="120000"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Max Salary ($)
            </label>
            <input
              type="number"
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
              placeholder="160000"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Description & Requirements */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Job Description *
          </label>
          <textarea
            rows="5"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed responsibilities, expectations, and role description..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white resize-none"
          ></textarea>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Requirements & Technical Qualifications
          </label>
          <textarea
            rows="4"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="Required skills, years of experience, education, tools..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white resize-none"
          ></textarea>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-brand-500/20 flex items-center space-x-2 transition-all"
          >
            <span>{loading ? 'Publishing...' : 'Publish Job Listing'}</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
