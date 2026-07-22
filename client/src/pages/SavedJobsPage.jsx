import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import JobCard from '../components/JobCard';
import ApplyModal from '../components/ApplyModal';
import { useToast } from '../context/ToastContext';
import API from '../services/api';
import { Bookmark, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SavedJobsPage() {
  const { showToast } = useToast();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplyJob, setSelectedApplyJob] = useState(null);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const res = await API.get('/saved');
      if (res.data.success) {
        setSavedJobs(res.data.savedJobs);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load saved jobs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleUnsave = (jobId) => {
    setSavedJobs((prev) => prev.filter((j) => j.id !== jobId && j.job_id !== jobId));
  };

  return (
    <div className="space-y-6 py-2">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Saved Job Bookmarks</h1>
        <p className="text-sm font-semibold text-slate-500">Your collection of bookmarked positions for quick reference & application</p>
      </div>

      {loading ? (
        <Loader message="Loading saved jobs..." />
      ) : savedJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map((job) => (
            <JobCard
              key={job.saved_id || job.id}
              job={job}
              isSavedInitial={true}
              onSaveToggle={(id) => handleUnsave(id)}
              onApplyClick={(j) => setSelectedApplyJob(j)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
          <Bookmark className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No bookmarked jobs yet</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Click the bookmark icon on any job card to save it for easy access later.
          </p>
          <Link
            to="/jobs"
            className="inline-block px-5 py-2.5 bg-brand-600 text-white font-bold rounded-xl text-xs shadow-md hover:bg-brand-700 transition-colors"
          >
            Find Jobs to Save
          </Link>
        </div>
      )}

      {selectedApplyJob && (
        <ApplyModal
          job={selectedApplyJob}
          onClose={() => setSelectedApplyJob(null)}
        />
      )}
    </div>
  );
}
