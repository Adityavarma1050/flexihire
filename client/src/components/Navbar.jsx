import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, 
  Search, 
  Bookmark, 
  FileText, 
  PlusCircle, 
  Users, 
  ShieldAlert, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown,
  Info,
  Sparkles,
  Headphones
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isSeeker, isEmployer, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-header shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Flexi<span className="text-blue-600">Hire</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80">
            <Link
              to="/jobs"
              className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center space-x-2 ${
                isActive('/jobs')
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Search className="w-4 h-4 text-blue-500" />
              <span>Browse Jobs</span>
            </Link>

            <Link
              to="/about"
              className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center space-x-1.5 ${
                isActive('/about')
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Info className="w-4 h-4 text-slate-400" />
              <span>About</span>
            </Link>

            {/* Role Specific Navigation */}
            {isAuthenticated && isSeeker && (
              <>
                <Link
                  to="/seeker/applications"
                  className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center space-x-1.5 ${
                    isActive('/seeker/applications')
                      ? 'bg-white text-blue-600 shadow-sm border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span>Applications</span>
                </Link>

                <Link
                  to="/seeker/saved"
                  className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center space-x-1.5 ${
                    isActive('/seeker/saved')
                      ? 'bg-white text-blue-600 shadow-sm border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Bookmark className="w-4 h-4 text-blue-500" />
                  <span>Saved</span>
                </Link>
              </>
            )}

            {isAuthenticated && isEmployer && (
              <>
                <Link
                  to="/employer/post-job"
                  className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center space-x-1.5 ${
                    isActive('/employer/post-job')
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Post Job</span>
                </Link>

                <Link
                  to="/employer/manage-jobs"
                  className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive('/employer/manage-jobs')
                      ? 'bg-white text-blue-600 shadow-sm border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  Manage Jobs
                </Link>

                <Link
                  to="/employer/applicants"
                  className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center space-x-1.5 ${
                    isActive('/employer/applicants')
                      ? 'bg-white text-blue-600 shadow-sm border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Users className="w-4 h-4 text-slate-500" />
                  <span>Applicants</span>
                </Link>
              </>
            )}

            {isAuthenticated && isAdmin && (
              <Link
                to="/admin/dashboard"
                className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center space-x-1.5 ${
                  isActive('/admin/dashboard')
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-amber-700 hover:bg-amber-50'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Admin Panel</span>
              </Link>
            )}
          </nav>

          {/* Desktop User Menu / Auth buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-3 p-1.5 pl-2.5 pr-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm border border-blue-200">
                    {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-900 leading-none truncate max-w-[120px]">
                      {user?.full_name}
                    </p>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                      {user?.role?.replace('_', ' ')}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Account</p>
                      <p className="text-sm font-bold text-slate-900 truncate mt-0.5">{user?.email}</p>
                    </div>

                    <Link
                      to={isEmployer ? '/employer/dashboard' : isAdmin ? '/admin/dashboard' : '/seeker/dashboard'}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium"
                    >
                      <User className="w-4 h-4 mr-3 text-blue-600" />
                      Dashboard
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium"
                    >
                      <User className="w-4 h-4 mr-3 text-blue-600" />
                      Edit Profile
                    </Link>

                    <Link
                      to="/support"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium"
                    >
                      <Headphones className="w-4 h-4 mr-3 text-blue-600" />
                      Help & Support
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 border-t border-slate-100 transition-colors font-semibold mt-1"
                    >
                      <LogOut className="w-4 h-4 mr-3 text-rose-500" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4.5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] flex items-center space-x-1.5"
                >
                  <Sparkles className="w-4 h-4 text-blue-200" />
                  <span>Get Started</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-base font-semibold text-slate-700 hover:bg-slate-50"
          >
            Browse Jobs
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-base font-semibold text-slate-700 hover:bg-slate-50"
          >
            About FlexiHire
          </Link>

          {isAuthenticated ? (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <Link
                to={isEmployer ? '/employer/dashboard' : isAdmin ? '/admin/dashboard' : '/seeker/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-base font-bold text-blue-600 bg-blue-50"
              >
                Dashboard ({user?.full_name})
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2.5 rounded-xl text-base font-semibold text-rose-600 hover:bg-rose-50"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 font-semibold text-slate-700 border border-slate-200 rounded-xl"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 font-bold text-white bg-blue-600 rounded-xl shadow"
              >
                Register Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
