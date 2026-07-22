import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Clock, Bookmark, Building2, ArrowRight, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import API from '../services/api';

export default function JobCard({ job, isSavedInitial = false, onSaveToggle, onApplyClick }) {
  const { isAuthenticated, isSeeker } = useAuth();
  const { showToast } = useToast();
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [saving, setSaving] = useState(false);

  const handleBookmarkToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      showToast('Please log in to save job bookmarks.', 'info');
      return;
    }

    if (!isSeeker) {
      showToast('Only Job Seekers can bookmark jobs.', 'info');
      return;
    }

    try {
      setSaving(true);
      if (isSaved) {
        await API.delete(`/saved/${job.id}`);
        setIsSaved(false);
        showToast('Job removed from saved items.', 'info');
      } else {
        await API.post('/saved', { job_id: job.id });
        setIsSaved(true);
        showToast('Job saved to your bookmarks!', 'success');
      }
      if (onSaveToggle) onSaveToggle(job.id, !isSaved);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update bookmark status', 'error');
    } finally {
      setSaving(false);
    }
  };

  const formatSalary = () => {
    if (!job.salary_min && !job.salary_max) return 'Salary Negotiable';
    if (job.salary_min && job.salary_max) {
      return `$${(job.salary_min / 1000).toFixed(0)}k - $${(job.salary_max / 1000).toFixed(0)}k/yr`;
    }
    return `$${((job.salary_min || job.salary_max) / 1000).toFixed(0)}k/yr`;
  };

  const getWorkplaceBadge = (type) => {
    switch (type) {
      case 'Remote': return 'badge-emerald';
      case 'Hybrid': return 'badge-purple';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getJobTypeBadge = (type) => {
    switch (type) {
      case 'Full-Time': return 'badge-blue';
      case 'Part-Time': return 'badge-amber';
      case 'Internship': return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Freelance': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="premium-card rounded-2xl p-6 flex flex-col justify-between relative">
      <div>
        {/* Header: Company & Bookmark */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center space-x-3.5">
            {job.company_logo ? (
              <img
                src={job.company_logo}
                alt={job.company_name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-sm"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-lg">
                <Building2 className="w-6 h-6 text-slate-400" />
              </div>
            )}
            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <p className="text-xs font-bold text-blue-600 tracking-wide uppercase">
                  {job.company_name || 'Verified Partner'}
                </p>
                {job.average_rating > 0 && (
                  <span className="flex items-center text-amber-500 font-black text-xs space-x-0.5">
                    <Star className="w-3 h-3 fill-amber-500 stroke-amber-500" />
                    <span className="text-slate-700 font-extrabold text-[10px]">{job.average_rating}</span>
                  </span>
                )}
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 line-clamp-1 hover:text-blue-600 transition-colors mt-0.5">
                {job.title}
              </h3>
            </div>
          </div>

          <button
            onClick={handleBookmarkToggle}
            disabled={saving}
            className={`p-2.5 rounded-xl border transition-all duration-200 ${
              isSaved
                ? 'bg-blue-50 text-blue-600 border-blue-200'
                : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title={isSaved ? 'Remove bookmark' : 'Bookmark job'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-blue-600' : ''}`} />
          </button>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getJobTypeBadge(job.job_type)}`}>
            {job.job_type || 'Full-Time'}
          </span>
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getWorkplaceBadge(job.workplace_type)}`}>
            {job.workplace_type || 'Remote'}
          </span>
          {job.experience_level && (
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
              {job.experience_level}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-5 font-normal">
          {job.description}
        </p>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <div>
          <span className="text-[11px] text-slate-400 font-semibold block uppercase tracking-wider">Salary</span>
          <p className="text-sm font-extrabold text-slate-900 flex items-center gap-0.5">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>{formatSalary()}</span>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to={`/jobs/${job.id}`}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Details
          </Link>

          <button
            onClick={() => onApplyClick ? onApplyClick(job) : null}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] flex items-center space-x-1"
          >
            <span>Apply</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
