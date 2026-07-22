import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import { useToast } from '../context/ToastContext';
import API from '../services/api';
import { FileText, MapPin, Clock, Trash2, ArrowUpRight, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function AppliedJobsPage() {
  const { showToast } = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await API.get('/applications');
      if (res.data.success) {
        setApplications(res.data.applications);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load applied jobs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async (appId) => {
    if (!window.confirm('Are you sure you want to withdraw this job application?')) return;

    try {
      const res = await API.delete(`/applications/${appId}`);
      if (res.data.success) {
        showToast('Application withdrawn successfully.', 'info');
        setApplications((prev) => prev.filter((a) => a.id !== appId));
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to withdraw application', 'error');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Accepted':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Accepted</span>
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Rejected</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Under Review</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 py-2">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Applied Jobs Track</h1>
        <p className="text-sm font-semibold text-slate-500">Monitor the live review status of all your submitted job applications</p>
      </div>

      {loading ? (
        <Loader message="Loading your applications..." />
      ) : applications.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[11px] font-extrabold uppercase tracking-wider border-b border-slate-200">
                  <th className="py-4 px-6">Position & Company</th>
                  <th className="py-4 px-6">Workplace & Location</th>
                  <th className="py-4 px-6">Applied Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{app.job_title}</div>
                      <div className="text-xs text-slate-500 font-semibold">{app.company_name}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1.5 text-xs text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{app.location}</span>
                      </div>
                      <span className="inline-block text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200 mt-1">
                        {app.job_type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500">
                      {new Date(app.applied_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-4 px-6">{getStatusBadge(app.status)}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/jobs/${app.job_id}`}
                          className="p-2 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                          title="View Job"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                        {app.status === 'Pending' && (
                          <button
                            onClick={() => handleWithdraw(app.id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Withdraw Application"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
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
          <FileText className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No job applications submitted yet</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Browse available opportunities and submit applications to start tracking your status here.
          </p>
          <Link
            to="/jobs"
            className="inline-block px-5 py-2.5 bg-brand-600 text-white font-bold rounded-xl text-xs shadow-md hover:bg-brand-700 transition-colors"
          >
            Explore Jobs Now
          </Link>
        </div>
      )}
    </div>
  );
}
