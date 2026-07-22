import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import JobCard from '../components/JobCard';
import ApplyModal from '../components/ApplyModal';
import Loader from '../components/Loader';
import API from '../services/api';
import { 
  Briefcase, 
  Code, 
  Palette, 
  TrendingUp, 
  BarChart, 
  Headphones, 
  ShieldCheck, 
  Users, 
  Sparkles, 
  ArrowRight,
  Zap,
  CheckCircle2,
  Building2,
  Award
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplyJob, setSelectedApplyJob] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, jobsRes] = await Promise.all([
          API.get('/categories'),
          API.get('/jobs?limit=6'),
        ]);

        if (catRes.data.success) setCategories(catRes.data.categories);
        if (jobsRes.data.success) setFeaturedJobs(jobsRes.data.jobs);
      } catch (err) {
        console.error('Failed to load landing page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchSubmit = ({ keyword, location, category }) => {
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (location) params.append('location', location);
    if (category) params.append('category', category);
    navigate(`/jobs?${params.toString()}`);
  };

  const getCategoryIcon = (slug) => {
    switch (slug) {
      case 'software-development': return <Code className="w-6 h-6 text-blue-600" />;
      case 'design-creative': return <Palette className="w-6 h-6 text-purple-600" />;
      case 'marketing-sales': return <TrendingUp className="w-6 h-6 text-emerald-600" />;
      case 'data-analytics': return <BarChart className="w-6 h-6 text-amber-600" />;
      case 'customer-support': return <Headphones className="w-6 h-6 text-rose-600" />;
      default: return <Briefcase className="w-6 h-6 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-20 py-4">
      {/* Ultra-Clean Hero Section */}
      <section className="relative overflow-hidden hero-gradient rounded-3xl p-8 sm:p-16 border border-slate-200/80 shadow-sm">
        <div className="relative z-10 max-w-4xl space-y-8">
          <div className="inline-flex items-center space-x-2.5 bg-blue-50 border border-blue-200 px-4 py-2 rounded-full text-xs font-bold text-blue-700">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Connecting Candidates & Employers Fast</span>
          </div>

          <h1 className="text-4xl sm:text-7xl font-black tracking-tight leading-[1.05] text-slate-900">
            Find Your Next <br />
            <span className="gradient-text">
              Flexible Career Move.
            </span>
          </h1>

          <p className="text-slate-600 text-base sm:text-xl leading-relaxed max-w-2xl font-normal">
            Discover verified Full-Time, Part-Time, Remote, Hybrid, Freelance, and Internship positions from leading tech companies.
          </p>

          {/* Search Bar */}
          <div className="pt-2">
            <SearchBar onSearch={handleSearchSubmit} categories={categories} />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 pt-2">
            <span className="font-bold text-slate-700 uppercase tracking-wider">Popular Tags:</span>
            {['Remote', 'Full-Time', 'React', 'Node.js', 'UI/UX', 'Hybrid'].map((tag) => (
              <button
                key={tag}
                onClick={() => navigate(`/jobs?keyword=${tag}`)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-blue-600 hover:text-white border border-slate-200 text-slate-700 shadow-sm transition-all duration-200 font-semibold"
              >
                #{tag}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-200/80">
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-slate-900">1,500+</p>
              <p className="text-xs text-slate-500 font-semibold">Active Postings</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-blue-600">450+</p>
              <p className="text-xs text-slate-500 font-semibold">Verified Companies</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-purple-600">98%</p>
              <p className="text-xs text-slate-500 font-semibold">Matching Accuracy</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-emerald-600">24 Hours</p>
              <p className="text-xs text-slate-500 font-semibold">Average Response</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-blue-600 text-xs font-bold uppercase tracking-widest mb-2">
              <Zap className="w-4 h-4" />
              <span>Job Domains</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Browse Categories
            </h2>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center space-x-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>Explore All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id || cat.slug}
              to={`/jobs?category=${cat.slug || cat.id}`}
              className="group premium-card rounded-2xl p-6 flex items-start space-x-4"
            >
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
                {getCategoryIcon(cat.slug)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                  {cat.description || 'Explore positions in this category.'}
                </p>
                <span className="inline-flex items-center text-xs font-bold text-blue-600 mt-3 group-hover:translate-x-1 transition-transform">
                  Browse jobs →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Part-Time Jobs Promotion Banner */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle decorative background shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full -ml-16 -mb-16 blur-lg pointer-events-none"></div>

        <div className="space-y-2.5 max-w-2xl relative z-10">
          <span className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/10">
            Flexible Hours • High Impact
          </span>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            Looking for Part-Time Opportunities?
          </h3>
          <p className="text-blue-100 text-xs sm:text-sm max-w-xl leading-relaxed">
            Balance your career, studies, or other responsibilities with flexible schedules. Explore remote and local part-time options with verified rates.
          </p>
        </div>
        
        <button
          onClick={() => navigate('/jobs?job_type=Part-Time')}
          className="px-6 py-3.5 bg-white hover:bg-slate-100 text-blue-700 font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg transition-transform duration-200 hover:scale-[1.02] active:scale-95 flex items-center space-x-2 shrink-0 relative z-10"
        >
          <span>Browse Part-Time Jobs</span>
          <ArrowRight className="w-4 h-4 text-blue-600" />
        </button>
      </section>

      {/* Featured Jobs */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-purple-600 text-xs font-bold uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Recommended</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Featured Positions
            </h2>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center space-x-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>See All Listings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <Loader text="Loading featured jobs..." />
        ) : featuredJobs.length === 0 ? (
          <div className="text-center py-12 premium-card rounded-2xl p-8 text-slate-500">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p>No featured jobs available right now. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApplyClick={(j) => setSelectedApplyJob(j)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Value Proposition */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-14 text-white shadow-xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-blue-500/20 text-blue-300 uppercase tracking-widest">
              Why FlexiHire?
            </span>
            <h2 className="text-3xl sm:text-5xl font-black leading-tight text-white">
              Simpler Hiring for Candidates & Employers.
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              Transparent salary insights, one-click application submission, and direct employer management.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-base font-bold text-white">Verified Employers</h4>
                  <p className="text-xs text-slate-300">All company listings are vetted and audited.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-6 h-6 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-base font-bold text-white">Flexible Work Arrangements</h4>
                  <p className="text-xs text-slate-300">Filter instantly by Remote, Hybrid, Full-Time, Part-Time, or Internship.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/90 border border-slate-700 p-8 rounded-2xl space-y-6 shadow-2xl">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-lg">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">TechCorp Systems</h4>
                <p className="text-xs text-slate-400">San Francisco, CA • Hiring Partner</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              "FlexiHire helped us connect with qualified full-stack candidates quickly. The application interface is clean and effortless!"
            </p>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400 font-semibold">Post your position today</span>
              <Link
                to="/employer/post-job"
                className="px-4.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow"
              >
                Post Job →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Modal for Job Application */}
      {selectedApplyJob && (
        <ApplyModal
          job={selectedApplyJob}
          onClose={() => setSelectedApplyJob(null)}
          onSuccess={() => setSelectedApplyJob(null)}
        />
      )}
    </div>
  );
}
