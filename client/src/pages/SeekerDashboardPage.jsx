import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import API from '../services/api';
import { 
  FileText, 
  Bookmark, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Search, 
  ArrowRight, 
  User 
} from 'lucide-react';

export default function SeekerDashboardPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [savedCount, setSavedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [appRes, savedRes] = await Promise.all([
          API.get('/applications'),
          API.get('/saved'),
        ]);

        if (appRes.data.success) setApplications(appRes.data.applications);
        if (savedRes.data.success) setSavedCount(savedRes.data.savedJobs.length);
      } catch (err) {
        console.error('Failed to load seeker dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const pendingCount = applications.filter((a) => a.status === 'Pending').length;
  const acceptedCount = applications.filter((a) => a.status === 'Accepted').length;

  return (
    <div className="space-y-8 py-2">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-800 rounded-3xl p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-white backdrop-blur-md">
            Candidate Control Center
          </span>
          <h1 className="text-3xl font-black">Welcome back, {user?.full_name}!</h1>
          <p className="text-brand-100 text-sm">
            Track job applications, review response statuses, and discover new matching roles.
          </p>
        </div>

        <Link
          to="/jobs"
          className="px-6 py-3 bg-white text-brand-700 hover:bg-brand-50 font-bold text-sm rounded-2xl shadow-lg transition-all flex items-center space-x-2 flex-shrink-0"
        >
          <Search className="w-4 h-4" />
          <span>Browse Open Jobs</span>
        </Link>
      </div>

      {/* Metrics Row */}
      {loading ? (
        <Loader message="Gathering dashboard stats..." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Applied</span>
              <FileText className="w-5 h-5 text-brand-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">{applications.length}</div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Pending Review</span>
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-3xl font-black text-amber-600">{pendingCount}</div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Accepted</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="text-3xl font-black text-emerald-600">{acceptedCount}</div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Saved Bookmarks</span>
              <Bookmark className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="text-3xl font-black text-indigo-600">{savedCount}</div>
          </div>
        </div>
      )}

      {/* Recent Applications Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-slate-900">Recent Job Applications</h2>
          <Link to="/seeker/applications" className="text-xs font-bold text-brand-600 hover:underline flex items-center space-x-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {applications.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {applications.slice(0, 5).map((app) => (
              <div key={app.id} className="py-3.5 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{app.job_title}</h4>
                  <span className="text-xs text-slate-500 font-semibold">{app.company_name} • {app.location}</span>
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
          <p className="text-sm font-semibold text-slate-500 text-center py-6">You haven't submitted any job applications yet.</p>
        )}
      </div>
    </div>
  );
}
