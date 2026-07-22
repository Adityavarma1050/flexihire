import React, { useState } from 'react';
import { X, Send, FileText, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import API from '../services/api';

export default function ApplyModal({ job, onClose, onSuccess }) {
  const { showToast } = useToast();
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!job) return;

    try {
      setSubmitting(true);
      const res = await API.post('/applications', {
        job_id: job.id,
        cover_letter: coverLetter,
        resume_url: resumeUrl,
      });

      if (res.data.success) {
        showToast('Application submitted successfully!', 'success');
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit application', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="inline-block px-2.5 py-1 text-xs font-bold text-brand-700 bg-brand-50 rounded-md border border-brand-200 mb-2">
            Applying for Position
          </span>
          <h2 className="text-xl font-bold text-slate-900">{job.title}</h2>
          <p className="text-sm font-semibold text-slate-500">{job.company_name || 'Verified Employer'} • {job.location}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Resume Link / URL
            </label>
            <div className="relative flex items-center">
              <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="url"
                required
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="https://drive.google.com/your-resume.pdf"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-500 focus:bg-white"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Provide a public link to your PDF resume (Google Drive, Dropbox, Portfolio)</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Cover Letter / Message to Hiring Manager
            </label>
            <textarea
              rows="5"
              required
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Introduce yourself and explain why you're a great fit for this role..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-500 focus:bg-white resize-none"
            ></textarea>
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 shadow-md shadow-brand-500/20 disabled:opacity-50 flex items-center space-x-2 transition-all"
            >
              {submitting ? (
                <span>Submitting...</span>
              ) : (
                <>
                  <span>Submit Application</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
