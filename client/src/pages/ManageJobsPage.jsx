import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import { useToast } from '../context/ToastContext';
import API from '../services/api';
import { Briefcase, Users, Trash2, ArrowUpRight, PlusCircle, ToggleLeft, ToggleRight } from 'lucide-react';

export default function ManageJobsPage() {
  const { showToast } = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployerJobs = async () => {
    try {
      setLoading(true);
      const res = await API.get('/employer/jobs');
      if (res.data.success) {
        setJobs(res.data.jobs);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load posted jobs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployerJobs();
  }, []);

  const handleToggleStatus = async (jobId, currentStatus) => {
    const newStatus = currentStatus === 'open' ? 'closed' : 'open';
    try {
      const res = await API.put(`/jobs/${jobId}`, { status: newStatus });
      if (res.data.success) {
        showToast(`Job status updated to ${newStatus}.`, 'success');
        setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j)));
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job listing permanently?')) return;

    try {
      const res = await API.delete(`/jobs/${jobId}`);
      if (res.data.success) {
        showToast('Job listing deleted.', 'info');
        setJobs((prev) => prev.filter((j) => j.id !== jobId));
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete job listing', 'error');
    }
  };

  return (
    <div className="space-y-6 py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Manage Posted Listings</h1>
          <p className="text-sm font-semibold text-slate-500">Monitor active listings, toggle availability, and review applicant metrics</p>
        </div>
        <Link
          to="/employer/post-job"
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-2 w-max"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Job</span>
        </Link>
      </div>

      {loading ? (
        <Loader message="Loading posted jobs..." />
      ) : jobs.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[11px] font-extrabold uppercase tracking-wider border-b border-slate-200">
                  <th className="py-4 px-6">Job Position</th>
                  <th className="py-4 px-6">Type & Location</th>
                  <th className="py-4 px-6">Applicants</th>
                  <th className="py-4 px-6">Listing Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{job.title}</div>
                      <div className="text-xs text-slate-500">{new Date(job.created_at).toLocaleDateString()}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-slate-800 text-xs font-bold">{job.job_type}</div>
                      <div className="text-slate-500 text-xs">{job.location}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
                        <Users className="w-3.5 h-3.5" />
                        <span>{job.application_count || 0} Candidates</span>
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleStatus(job.id, job.status)}
                        className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          job.status === 'open'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-slate-200 text-slate-700 border border-slate-300'
                        }`}
                      >
                        {job.status === 'open' ? (
                          <>
                            <ToggleRight className="w-4 h-4 text-emerald-600" />
                            <span>Open</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-4 h-4 text-slate-500" />
                            <span>Closed</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/jobs/${job.id}`}
                          className="p-2 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                          title="View Details"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
          <Briefcase className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No job listings posted yet</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Create your first job listing to start receiving candidate applications.
          </p>
          <Link
            to="/employer/post-job"
            className="inline-block px-5 py-2.5 bg-brand-600 text-white font-bold rounded-xl text-xs shadow-md hover:bg-brand-700 transition-colors"
          >
            Post Your First Job
          </Link>
        </div>
      )}
    </div>
  );
}
