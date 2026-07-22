import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home, Search } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900">404</h1>
          <h2 className="text-xl font-bold text-slate-800">Page Not Found</h2>
          <p className="text-sm font-semibold text-slate-500">
            The page or resource you are looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex items-center justify-center space-x-3 pt-2">
          <Link
            to="/"
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Link>

          <Link
            to="/jobs"
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-md transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Search Jobs</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
