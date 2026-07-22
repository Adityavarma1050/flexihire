import React from 'react';
import { Filter, RefreshCw } from 'lucide-react';

export default function FilterSidebar({ filters, setFilters, onReset }) {
  const jobTypes = ['Full-Time', 'Part-Time', 'Internship', 'Freelance', 'Temporary', 'Weekend'];
  const workplaceTypes = ['Remote', 'On-Site', 'Hybrid'];
  const experienceLevels = ['Entry', 'Mid', 'Senior', 'Executive'];

  const handleJobTypeChange = (type) => {
    setFilters((prev) => ({
      ...prev,
      job_type: prev.job_type === type ? '' : type,
    }));
  };

  const handleWorkplaceChange = (type) => {
    setFilters((prev) => ({
      ...prev,
      workplace_type: prev.workplace_type === type ? '' : type,
    }));
  };

  const handleExperienceChange = (exp) => {
    setFilters((prev) => ({
      ...prev,
      experience_level: prev.experience_level === exp ? '' : exp,
    }));
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <Filter className="w-4 h-4 text-brand-600" />
          <span>Filter Jobs</span>
        </h3>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-slate-500 hover:text-brand-600 flex items-center space-x-1 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Workplace Type */}
      <div>
        <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">
          Workplace Model
        </h4>
        <div className="space-y-2">
          {workplaceTypes.map((type) => (
            <label key={type} className="flex items-center space-x-2.5 text-sm font-semibold text-slate-700 cursor-pointer hover:text-brand-600">
              <input
                type="checkbox"
                checked={filters.workplace_type === type}
                onChange={() => handleWorkplaceChange(type)}
                className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Job Type */}
      <div>
        <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">
          Job Type
        </h4>
        <div className="space-y-2">
          {jobTypes.map((type) => (
            <label key={type} className="flex items-center space-x-2.5 text-sm font-semibold text-slate-700 cursor-pointer hover:text-brand-600">
              <input
                type="checkbox"
                checked={filters.job_type === type}
                onChange={() => handleJobTypeChange(type)}
                className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div>
        <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">
          Experience Level
        </h4>
        <div className="space-y-2">
          {experienceLevels.map((exp) => (
            <label key={exp} className="flex items-center space-x-2.5 text-sm font-semibold text-slate-700 cursor-pointer hover:text-brand-600">
              <input
                type="checkbox"
                checked={filters.experience_level === exp}
                onChange={() => handleExperienceChange(exp)}
                className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
              />
              <span>{exp} Level</span>
            </label>
          ))}
        </div>
      </div>

      {/* Salary Filter */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
            Min Salary
          </h4>
          <span className="text-xs font-bold text-brand-600">
            {filters.min_salary > 0 ? `$${parseInt(filters.min_salary, 10).toLocaleString()}` : 'Any'}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="200000"
          step="10000"
          value={filters.min_salary || 0}
          onChange={(e) => setFilters((prev) => ({ ...prev, min_salary: e.target.value }))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
        />
      </div>
    </div>
  );
}
