import React from 'react';
import { Briefcase, Shield, Zap, Globe, CheckCircle2, Clock, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="space-y-12 py-4">
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-block px-3 py-1 text-xs font-extrabold text-brand-700 bg-brand-50 rounded-full border border-brand-200">
          About FlexiHire
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Simplifying modern hiring for employers & talent.
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          FlexiHire is designed to eliminate recruitment complexity, connecting job seekers and employers directly with transparent job criteria and streamlined applications.
        </p>
      </section>

      {/* Supported Job Types Grid */}
      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Supported Employment Models</h2>
          <p className="text-sm text-slate-500">Every career arrangement catered for in one unified marketplace</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { title: 'Full-Time', desc: 'Permanent roles with full benefit structures' },
            { title: 'Part-Time', desc: 'Flexible hourly or half-day commitments' },
            { title: 'Remote', desc: 'Work from anywhere with location freedom' },
            { title: 'Hybrid', desc: 'Combination of in-office and remote days' },
            { title: 'Freelance & Contract', desc: 'Project-based gig opportunities' },
            { title: 'Internship', desc: 'Entry-level career starting positions' },
            { title: 'Temporary', desc: 'Short-term seasonal assignments' },
            { title: 'Weekend Work', desc: 'Secondary income weekend slots' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
                ✓
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-normal">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Speed & Simplicity</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            No endless application forms. Quick job posting and instant application submissions.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Verified Listings</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            All company accounts and job listings undergo moderation to prevent spam and fake posts.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Global & Local</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Filter by city, country, or nationwide remote status with real-time salary expectations.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6">
        <h2 className="text-3xl font-extrabold">Ready to explore opportunities?</h2>
        <div className="flex items-center justify-center space-x-4">
          <Link
            to="/jobs"
            className="px-6 py-3 font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-lg transition-all"
          >
            Browse Jobs
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
          >
            Create Account
          </Link>
        </div>
      </section>
    </div>
  );
}
