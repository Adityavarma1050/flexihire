import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import API from '../services/api';
import { 
  Briefcase, 
  Users, 
  PlusCircle, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Building2,
  Bell
} from 'lucide-react';

export default function EmployerDashboardPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployerData = async () => {
      try {
        setLoading(true);
        const [jobsRes, appRes, notifRes] = await Promise.all([
          API.get('/employer/jobs'),
          API.get('/employer/applications'),
          API.get('/employer/notifications').catch(() => ({ data: { success: false } })),
        ]);

        if (jobsRes.data.success) setJobs(jobsRes.data.jobs);
        if (appRes.data.success) setApplications(appRes.data.applications);
        if (notifRes.data && notifRes.data.success) setNotifications(notifRes.data.notifications);
      } catch (err) {
        console.error('Failed to load employer dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployerData();
  }, []);

  const openJobsCount = jobs.filter((j) => j.status === 'open').length;

  return (
    <div className="space-y-8 py-2">
      {/* Notifications Alert Bar */}
      {notifications.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm">
            <Bell className="w-4 h-4 text-amber-600 animate-bounce" />
            <span>Application Alerts & Notifications ({notifications.length})</span>
          </div>
          <div className="space-y-1 pl-6 text-xs text-amber-800 font-semibold">
            {notifications.slice(0, 3).map((n) => (
              <div key={n.id} className="py-0.5">
                {n.message} <span className="text-amber-600/70 font-normal">({new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Employer Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 bg-brand-500/20 text-brand-300 rounded-full text-xs font-bold border border-brand-500/30">
            Employer Portal
          </span>
          <h1 className="text-3xl font-black">
            {user?.company?.company_name || user?.full_name} Overview
          </h1>
          <p className="text-slate-300 text-sm">
            Post new open roles, track candidate applications, and hire top talent.
          </p>
        </div>

        <Link
          to="/employer/post-job"
          className="px-6 py-3.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-brand-500/20 transition-all flex items-center space-x-2 flex-shrink-0"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Post a New Job</span>
        </Link>
      </div>

      {/* Metrics Row */}
      {loading ? (
        <Loader message="Loading employer statistics..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Jobs Posted</span>
              <Briefcase className="w-5 h-5 text-brand-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">{jobs.length}</div>
            <p className="text-xs font-semibold text-emerald-600">{openJobsCount} Active listings</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Applications</span>
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-3xl font-black text-purple-600">{applications.length}</div>
            <p className="text-xs font-semibold text-slate-500">Across all job postings</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Candidates Accepted</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="text-3xl font-black text-emerald-600">
              {applications.filter((a) => a.status === 'Accepted').length}
            </div>
            <p className="text-xs font-semibold text-slate-500">Selected hires</p>
          </div>
        </div>
      )}

      {/* Recent Applications Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-slate-900">Recent Candidate Submissions</h2>
          <Link to="/employer/applicants" className="text-xs font-bold text-brand-600 hover:underline flex items-center space-x-1">
            <span>Manage All Applicants</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {applications.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {applications.slice(0, 5).map((app) => (
              <div key={app.id} className="py-3.5 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{app.seeker_name}</h4>
                  <span className="text-xs text-slate-500 font-semibold">Applied for {app.job_title}</span>
                </div>
                <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                  app.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' :
                  app.status === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm font-semibold text-slate-500 text-center py-6">No applications received yet.</p>
        )}
      </div>
    </div>
  );
}
