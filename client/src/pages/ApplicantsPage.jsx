import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import { useToast } from '../context/ToastContext';
import API from '../services/api';
import { Users, Mail, Phone, ExternalLink, FileText, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function ApplicantsPage() {
  const { showToast } = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoverLetter, setSelectedCoverLetter] = useState(null);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const res = await API.get('/employer/applications');
      if (res.data.success) {
        setApplications(res.data.applications);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load applicants list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const res = await API.put(`/applications/${appId}`, { status: newStatus });
      if (res.data.success) {
        showToast(`Candidate status set to ${newStatus}.`, 'success');
        setApplications((prev) =>
          prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
        );
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update candidate status', 'error');
    }
  };

  return (
    <div className="space-y-6 py-2">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Review Candidate Applicants</h1>
        <p className="text-sm font-semibold text-slate-500">Evaluate incoming candidate resumes, cover letters, and accept or reject submissions</p>
      </div>

      {loading ? (
        <Loader message="Loading candidate applications..." />
      ) : applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 font-extrabold text-lg flex items-center justify-center border border-brand-200">
                    {app.seeker_name ? app.seeker_name.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{app.seeker_name}</h3>
                    <p className="text-xs font-semibold text-slate-500">
                      Applied for <span className="font-bold text-brand-600">{app.job_title}</span> • {new Date(app.applied_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Status selector buttons (locked if already accepted/rejected) */}
                <div className="shrink-0">
                  {app.status === 'Accepted' && (
                    <span className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-2xl text-xs font-black shadow-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Application Accepted</span>
                    </span>
                  )}
                  {app.status === 'Rejected' && (
                    <span className="inline-flex items-center space-x-1.5 px-4 py-2 bg-rose-100 text-rose-800 border border-rose-300 rounded-2xl text-xs font-black shadow-sm">
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>Application Rejected</span>
                    </span>
                  )}
                  {app.status === 'Pending' && (
                    <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
                      <span className="px-2.5 py-1 text-[10px] text-amber-800 font-extrabold uppercase bg-amber-100 rounded-lg border border-amber-200">
                        Under Review
                      </span>

                      <button
                        onClick={() => handleStatusChange(app.id, 'Accepted')}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 shadow-sm"
                      >
                        Accept
                      </button>

                      <button
                        onClick={() => handleStatusChange(app.id, 'Rejected')}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 shadow-sm"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact & Cover Letter Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2 text-slate-700">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{app.seeker_email}</span>
                  </div>
                  {app.seeker_phone && (
                    <div className="flex items-center space-x-2 text-slate-700">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{app.seeker_phone}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-start sm:justify-end space-x-3">
                  {app.resume_url && (
                    <a
                      href={app.resume_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center space-x-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      <span>View Resume</span>
                    </a>
                  )}

                  {app.cover_letter && (
                    <button
                      onClick={() => setSelectedCoverLetter({ name: app.seeker_name, letter: app.cover_letter })}
                      className="px-3 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs flex items-center space-x-1.5 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Read Cover Letter</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
          <Users className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No applicant submissions yet</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            When candidates submit applications for your job listings, they will appear here.
          </p>
        </div>
      )}

      {/* Cover Letter Modal */}
      {selectedCoverLetter && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Cover Letter from {selectedCoverLetter.name}</h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200 max-h-80 overflow-y-auto whitespace-pre-line">
              {selectedCoverLetter.letter}
            </p>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedCoverLetter(null)}
                className="px-4 py-2 bg-slate-800 text-white font-bold rounded-xl text-xs"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
