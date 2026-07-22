import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Briefcase, Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password.', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await login(email, password);
      showToast(`Welcome back, ${res.user.full_name}!`, 'success');
      
      // Redirect based on role or prior path
      if (res.user.role === 'employer') {
        navigate('/employer/dashboard');
      } else if (res.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate(from === '/' ? '/jobs' : from);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Invalid login credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-8">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 mx-auto flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <Briefcase className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Sign In to FlexiHire</h1>
          <p className="text-sm font-semibold text-slate-500">Access your candidate or employer dashboard</p>
        </div>

        {/* Demo Accounts Bar for Quick Evaluation */}
        <div className="bg-brand-50/70 border border-brand-200/80 rounded-2xl p-3.5 text-xs text-brand-900 space-y-1">
          <p className="font-bold text-brand-800 uppercase tracking-wide text-[10px]">Demo Quick Test Credentials:</p>
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => { setEmail('seeker@flexihire.com'); setPassword('password123'); }}
              className="text-left p-1.5 bg-white rounded-lg border border-brand-200 hover:bg-brand-100/50 font-medium truncate"
            >
              <span className="font-bold">Job Seeker:</span> seeker@flexihire.com
            </button>
            <button
              type="button"
              onClick={() => { setEmail('employer@techcorp.com'); setPassword('password123'); }}
              className="text-left p-1.5 bg-white rounded-lg border border-brand-200 hover:bg-brand-100/50 font-medium truncate"
            >
              <span className="font-bold">Employer:</span> employer@techcorp.com
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-500 focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 disabled:opacity-50 flex items-center justify-center space-x-2 transition-all"
          >
            <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-sm font-medium text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-brand-600 hover:underline">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
