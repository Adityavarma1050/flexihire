import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Loader from '../components/Loader';
import ApplyModal from '../components/ApplyModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import API from '../services/api';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Clock, 
  Briefcase, 
  CheckCircle2, 
  Globe, 
  Send, 
  Bookmark, 
  ArrowLeft,
  Star
} from 'lucide-react';

export default function JobDetailPage() {
  const { id } = useParams();
  const { isSeeker, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const [detailTab, setDetailTab] = useState('details'); // 'details' or 'reviews'
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchReviews = async () => {
    if (!job?.company_id) return;
    try {
      setLoadingReviews(true);
      const res = await API.get(`/companies/${job.company_id}/reviews`);
      if (res.data.success) {
        setReviews(res.data.reviews);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (detailTab === 'reviews') {
      fetchReviews();
    }
  }, [detailTab, job?.company_id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    try {
      setSubmittingReview(true);
      const res = await API.post(`/companies/${job.company_id}/reviews`, {
        rating: userRating,
        review_text: reviewText.trim(),
      });

      if (res.data.success) {
        showToast('Review submitted successfully!', 'success');
        setReviewText('');
        setUserRating(5);
        fetchReviews();
        // Refresh job to update average rating metrics
        const jobRes = await API.get(`/jobs/${id}`);
        if (jobRes.data.success) {
          setJob(jobRes.data.job);
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/jobs/${id}`);
        if (res.data.success) {
          setJob(res.data.job);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [id]);

  if (loading) return <Loader message="Fetching job details..." />;

  if (error || !job) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4 max-w-md mx-auto my-12">
        <h3 className="text-xl font-bold text-slate-900">Job Not Found</h3>
        <p className="text-sm text-slate-500">{error || 'The job listing you are looking for does not exist.'}</p>
        <Link to="/jobs" className="inline-block px-5 py-2.5 bg-brand-600 text-white font-bold rounded-xl text-xs">
          Back to Jobs Search
        </Link>
      </div>
    );
  }

  const formatSalary = () => {
    if (!job.salary_min && !job.salary_max) return 'Salary Negotiable';
    const period = job.salary_period ? `/${job.salary_period.replace('yearly', 'yr').replace('monthly', 'mo').replace('hourly', 'hr')}` : '';
    if (job.salary_min && job.salary_max) {
      return `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}${period}`;
    }
    return `$${(job.salary_min || job.salary_max).toLocaleString()}${period}`;
  };

  return (
    <div className="space-y-8 py-2">
      {/* Back Button */}
      <Link
        to="/jobs"
        className="inline-flex items-center space-x-2 text-sm font-bold text-slate-600 hover:text-brand-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Jobs</span>
      </Link>

      {/* Main Job Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start space-x-4">
          {job.company_logo ? (
            <img
              src={job.company_logo}
              alt={job.company_name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-100 shadow-sm"
            />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-2xl shadow-sm">
              <Building2 className="w-8 h-8 text-slate-400" />
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 flex-wrap">
              <span className="text-sm font-bold text-brand-600">{job.company_name || 'Verified Employer'}</span>
              {job.average_rating > 0 && (
                <span className="flex items-center text-amber-500 font-extrabold text-xs space-x-0.5 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" />
                  <span className="text-slate-800">{job.average_rating} ({job.reviews_count} reviews)</span>
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 pt-1">
              <span className="flex items-center space-x-1">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{job.location}</span>
              </span>
              <span>•</span>
              <span className="px-2.5 py-0.5 rounded-md bg-brand-50 text-brand-700 font-bold border border-brand-200">
                {job.job_type}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold border border-slate-200">
                {job.workplace_type}
              </span>
              <span>•</span>
              <span className="text-emerald-700 font-bold flex items-center">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                <span>{formatSalary()}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action button */}
        {isSeeker && (
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <button
              onClick={() => setShowApplyModal(true)}
              className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-brand-500/20 flex items-center justify-center space-x-2 transition-all hover:scale-105"
            >
              <span>Apply for this Job</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Grid Specs & Description */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          {/* Tab Headers */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setDetailTab('details')}
              className={`pb-4 px-4 font-bold text-sm tracking-wide transition-all border-b-2 ${
                detailTab === 'details'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Job Details
            </button>
            <button
              onClick={() => setDetailTab('reviews')}
              className={`pb-4 px-4 font-bold text-sm tracking-wide transition-all border-b-2 flex items-center space-x-1.5 ${
                detailTab === 'reviews'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>Company Reviews</span>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-bold">
                {job.reviews_count || 0}
              </span>
            </button>
          </div>

          {detailTab === 'details' ? (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-base font-bold text-slate-800 mb-3">Job Description</h3>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </div>

              {job.requirements && (
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-base font-bold text-slate-800 mb-3">Requirements & Qualifications</h3>
                  <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {job.requirements}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h3 className="text-base font-bold text-slate-800">
                Candidate Reviews for {job.company_name}
              </h3>

              {/* Review submit form */}
              {isAuthenticated && isSeeker && (
                <form onSubmit={handleSubmitReview} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Leave a Review for this Company</h4>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-500 font-bold">Your Rating:</span>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setUserRating(star)}
                          className="p-1 focus:outline-none"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= userRating
                                ? 'fill-amber-400 stroke-amber-400'
                                : 'text-slate-300 stroke-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <textarea
                      rows="3"
                      required
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Write details about work culture, benefits, management, and environment..."
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Rating & Review'}
                  </button>
                </form>
              )}

              {/* Reviews List */}
              {loadingReviews ? (
                <Loader message="Loading company reviews..." />
              ) : reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200">
                            {rev.seeker_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">{rev.seeker_name}</p>
                            <p className="text-[10px] text-slate-400 font-bold">
                              Reviewed on {new Date(rev.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Stars */}
                        <div className="flex items-center space-x-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= rev.rating
                                  ? 'fill-amber-400 stroke-amber-400'
                                  : 'text-slate-200 stroke-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium pl-1">
                        {rev.review_text}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 space-y-1">
                  <Star className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-500">No reviews yet for this company.</p>
                  <p className="text-[10px] text-slate-400">Be the first to review if you apply and work here!</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Company Overview Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Company Snapshot
            </h3>

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Company Name</span>
                <span className="font-bold text-slate-900">{job.company_name || 'Tech Organization'}</span>
              </div>

              {job.average_rating > 0 && (
                <div>
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Company Rating</span>
                  <span className="font-bold text-slate-900 flex items-center space-x-1 mt-0.5">
                    <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                    <span>{job.average_rating} / 5.0 ({job.reviews_count} reviews)</span>
                  </span>
                </div>
              )}

              {job.company_industry && (
                <div>
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Industry</span>
                  <span className="font-semibold text-slate-700">{job.company_industry}</span>
                </div>
              )}

              {job.company_website && (
                <div>
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Website</span>
                  <a
                    href={job.company_website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-600 font-bold hover:underline flex items-center space-x-1 text-xs"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>{job.company_website}</span>
                  </a>
                </div>
              )}

              {job.company_description && (
                <div>
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">About Company</span>
                  <p className="text-slate-600 text-xs leading-relaxed">{job.company_description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showApplyModal && (
        <ApplyModal
          job={job}
          onClose={() => setShowApplyModal(false)}
        />
      )}
    </div>
  );
}
