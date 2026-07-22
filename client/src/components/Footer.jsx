import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ShieldCheck, Heart, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white">
                Flexi<span className="text-blue-400">Hire</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              Connecting qualified professionals with flexible Full-Time, Part-Time, Remote, Hybrid, Freelance, Internship, and Weekend opportunities.
            </p>
            <div className="flex items-center space-x-2 pt-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">React</span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20">Node.js</span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">MongoDB</span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">JWT Auth</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Job Arrangements</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/jobs?job_type=Full-Time" className="hover:text-blue-400 transition-colors">Full-Time Positions</Link></li>
              <li><Link to="/jobs?job_type=Part-Time" className="hover:text-blue-400 transition-colors">Part-Time Jobs</Link></li>
              <li><Link to="/jobs?workplace_type=Remote" className="hover:text-blue-400 transition-colors">Remote Opportunities</Link></li>
              <li><Link to="/jobs?workplace_type=Hybrid" className="hover:text-blue-400 transition-colors">Hybrid Work</Link></li>
              <li><Link to="/jobs?job_type=Internship" className="hover:text-blue-400 transition-colors">Internships</Link></li>
              <li><Link to="/jobs?job_type=Freelance" className="hover:text-blue-400 transition-colors">Freelance & Contract</Link></li>
            </ul>
          </div>

          {/* Employers */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">For Employers</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/employer/post-job" className="hover:text-blue-400 transition-colors">Post a Job</Link></li>
              <li><Link to="/employer/manage-jobs" className="hover:text-blue-400 transition-colors">Manage Postings</Link></li>
              <li><Link to="/employer/applicants" className="hover:text-blue-400 transition-colors">Review Candidates</Link></li>
              <li><Link to="/register" className="hover:text-blue-400 transition-colors">Employer Signup</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} FlexiHire Job Marketplace. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>MongoDB Cloud Secured</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
