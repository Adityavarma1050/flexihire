import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import JobCard from '../components/JobCard';
import Pagination from '../components/Pagination';
import ApplyModal from '../components/ApplyModal';
import Loader from '../components/Loader';
import API from '../services/api';
import { SlidersHorizontal, AlertCircle } from 'lucide-react';

export default function SearchJobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedApplyJob, setSelectedApplyJob] = useState(null);

  // Filters state
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    location: searchParams.get('location') || '',
    category: searchParams.get('category') || '',
    job_type: searchParams.get('job_type') || '',
    workplace_type: searchParams.get('workplace_type') || '',
    experience_level: searchParams.get('experience_level') || '',
    min_salary: searchParams.get('min_salary') || '0',
  });

  useEffect(() => {
    API.get('/categories')
      .then((res) => {
        if (res.data.success) setCategories(res.data.categories);
      })
      .catch((err) => console.error(err));
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      queryParams.append('page', currentPage);
      queryParams.append('limit', 9);

      if (filters.keyword) queryParams.append('keyword', filters.keyword);
      if (filters.location) queryParams.append('location', filters.location);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.job_type) queryParams.append('job_type', filters.job_type);
      if (filters.workplace_type) queryParams.append('workplace_type', filters.workplace_type);
      if (filters.experience_level) queryParams.append('experience_level', filters.experience_level);
      if (filters.min_salary && filters.min_salary !== '0') queryParams.append('min_salary', filters.min_salary);

      const res = await API.get(`/jobs?${queryParams.toString()}`);
      if (res.data.success) {
        setJobs(res.data.jobs);
        setTotalPages(res.data.totalPages);
        setTotalCount(res.data.totalCount);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [currentPage, filters]);

  const handleSearchHeaderSubmit = ({ keyword, location, category }) => {
    setFilters((prev) => ({
      ...prev,
      keyword,
      location,
      category,
    }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      keyword: '',
      location: '',
      category: '',
      job_type: '',
      workplace_type: '',
      experience_level: '',
      min_salary: '0',
    });
    setSearchParams({});
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 py-2">
      {/* Top Search Bar Header */}
      <div className="bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-800">
        <h1 className="text-2xl font-black text-white mb-4">Search Job Marketplace</h1>
        <SearchBar
          onSearch={handleSearchHeaderSubmit}
          initialKeyword={filters.keyword}
          initialLocation={filters.location}
          initialCategory={filters.category}
          categories={categories}
        />
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-sm font-bold text-slate-800">
            {totalCount} jobs found
          </span>
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center space-x-2 px-3 py-1.5 bg-brand-50 text-brand-700 rounded-lg text-xs font-bold border border-brand-200"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{showMobileFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </button>
        </div>

        {/* Filter Sidebar Column */}
        <div className={`lg:col-span-3 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            onReset={handleResetFilters}
          />
        </div>

        {/* Jobs List Column */}
        <div className="lg:col-span-9 space-y-6">
          <div className="hidden lg:flex items-center justify-between">
            <span className="text-sm font-bold text-slate-600">
              Showing <span className="text-slate-900">{jobs.length}</span> of <span className="text-slate-900">{totalCount}</span> open positions
            </span>
          </div>

          {loading ? (
            <Loader message="Searching live database..." />
          ) : jobs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onApplyClick={(j) => setSelectedApplyJob(j)}
                  />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4">
              <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">No jobs match your criteria</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                Try loosening your filters or keyword terms to see more available job openings.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl shadow-md hover:bg-brand-700 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Application Modal */}
      {selectedApplyJob && (
        <ApplyModal
          job={selectedApplyJob}
          onClose={() => setSelectedApplyJob(null)}
        />
      )}
    </div>
  );
}
