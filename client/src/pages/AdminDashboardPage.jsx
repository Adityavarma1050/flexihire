import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import { useToast } from '../context/ToastContext';
import API from '../services/api';
import { 
  ShieldAlert, 
  Users, 
  Briefcase, 
  Trash2, 
  Ban, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  TrendingUp,
  Edit2,
  Plus,
  X
} from 'lucide-react';

function MiniLineChart({ data, dataKey, color, title }) {
  const width = 500;
  const height = 180;
  const padding = 30;

  const maxVal = Math.max(...data.map(d => d[dataKey] || 0), 4);

  const points = data.map((item, index) => {
    const x = padding + (index * (width - 2 * padding)) / (data.length - 1);
    const y = height - padding - (maxVal > 0 ? (item[dataKey] / maxVal) * (height - 2 * padding) : 0);
    return { x, y, value: item[dataKey], label: item.date };
  });

  const linePath = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
  const areaPath = `M ${padding},${height - padding} L ${points.map(p => `${p.x},${p.y}`).join(' L ')} L ${width - padding},${height - padding} Z`;

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title} (Last 7 Days)</h4>
        <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-500">Max: {maxVal}</span>
      </div>
      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible">
          <defs>
            <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
              <stop offset="100%" stopColor={color} stopOpacity="0.0"/>
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#f8fafc" strokeWidth="1" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#f8fafc" strokeWidth="1" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e2e8f0" strokeWidth="1.5" />

          {/* Area under the line */}
          <path d={areaPath} fill={`url(#grad-${dataKey})`} />

          {/* Sparkline path */}
          <path d={linePath} fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data Points */}
          {points.map((p, idx) => (
            <g key={idx} className="group/dot cursor-pointer">
              <circle cx={p.x} cy={p.y} r="4.5" fill="#ffffff" stroke={color} strokeWidth="3" />
              {/* Tooltip on hover */}
              <foreignObject x={p.x - 30} y={p.y - 38} width="60" height="25" className="opacity-0 hover:opacity-100 group-hover/dot:opacity-100 transition-opacity duration-150 pointer-events-none overflow-visible">
                <div className="bg-slate-900 text-white text-[10px] font-black text-center py-0.5 px-1.5 rounded shadow-lg whitespace-nowrap">
                  {p.value}
                </div>
              </foreignObject>
            </g>
          ))}

          {/* X axis labels */}
          {points.map((p, idx) => (
            <text key={idx} x={p.x} y={height - 10} textAnchor="middle" fill="#94a3b8" className="text-[10px] font-bold">
              {p.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs', 'users', 'categories', 'analytics'
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(true);

  // User Filter States
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userStatusFilter, setUserStatusFilter] = useState('all');

  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      (u.full_name || '').toLowerCase().includes(userSearch.toLowerCase()) || 
      (u.email || '').toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    const matchesStatus = userStatusFilter === 'all' || u.status === userStatusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Category Modal States
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [submittingCat, setSubmittingCat] = useState(false);

  const fetchModerationData = async () => {
    try {
      setLoading(true);
      const [userRes, jobRes] = await Promise.all([
        API.get('/admin/users'),
        API.get('/admin/jobs'),
      ]);

      if (userRes.data.success) setUsers(userRes.data.users);
      if (jobRes.data.success) setJobs(jobRes.data.jobs);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load moderation data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await API.get('/categories');
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchTelemetry = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/telemetry');
      if (res.data.success) {
        setTelemetry(res.data);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load telemetry analytics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'jobs' || activeTab === 'users') {
      fetchModerationData();
    } else if (activeTab === 'categories') {
      fetchCategories();
    } else if (activeTab === 'analytics') {
      fetchTelemetry();
    }
  }, [activeTab]);

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      const res = await API.put(`/admin/users/${userId}/status`, { status: nextStatus });
      if (res.data.success) {
        showToast(`User status updated to ${nextStatus}`, 'success');
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u)));
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update user status', 'error');
    }
  };

  const handleDeleteFakeJob = async (jobId) => {
    if (!window.confirm('Delete this job listing permanently for platform moderation?')) return;

    try {
      const res = await API.delete(`/admin/job/${jobId}`);
      if (res.data.success) {
        showToast('Fake / Fraudulent job listing deleted.', 'info');
        setJobs((prev) => prev.filter((j) => j.id !== jobId));
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to remove job', 'error');
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!catName.trim()) {
      showToast('Category name is required', 'error');
      return;
    }

    try {
      setSubmittingCat(true);
      if (editingCategory) {
        const res = await API.put(`/categories/${editingCategory.id}`, {
          name: catName.trim(),
          description: catDesc.trim(),
        });
        if (res.data.success) {
          showToast('Category updated successfully!', 'success');
          setCategories((prev) =>
            prev.map((c) => (c.id === editingCategory.id ? res.data.category : c))
          );
        }
      } else {
        const res = await API.post('/categories', {
          name: catName.trim(),
          description: catDesc.trim(),
        });
        if (res.data.success) {
          showToast('Category created successfully!', 'success');
          setCategories((prev) => [...prev, res.data.category].sort((a, b) => a.name.localeCompare(b.name)));
        }
      }
      setShowCatModal(false);
      setEditingCategory(null);
      setCatName('');
      setCatDesc('');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save category', 'error');
    } finally {
      setSubmittingCat(false);
    }
  };

  const handleEditClick = (cat) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatDesc(cat.description || '');
    setShowCatModal(true);
  };

  const handleDeleteCategory = async (catId) => {
    if (!window.confirm('Are you sure you want to delete this category? Jobs in this category may be affected.')) return;
    try {
      const res = await API.delete(`/categories/${catId}`);
      if (res.data.success) {
        showToast('Category deleted successfully.', 'info');
        setCategories((prev) => prev.filter((c) => c.id !== catId));
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete category', 'error');
    }
  };

  return (
    <div className="space-y-8 py-2">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-amber-900 via-slate-900 to-amber-950 rounded-3xl p-8 text-white shadow-xl border border-amber-800 flex items-center justify-between">
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold border border-amber-500/30">
            System Administration
          </span>
          <h1 className="text-3xl font-black">FlexiHire Admin Console</h1>
          <p className="text-amber-100 text-sm">
            Monitor platform security, manage categories, analyze telemetry, and moderate job postings.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 bg-slate-200 p-1.5 rounded-2xl w-max">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'jobs' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Moderate Jobs
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'users' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Manage Users
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
            activeTab === 'categories' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Manage Categories</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
            activeTab === 'analytics' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>System Analytics</span>
        </button>
      </div>

      {loading ? (
        <Loader message="Loading dashboard section..." />
      ) : (
        <>
          {/* Jobs Tab View */}
          {activeTab === 'jobs' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-200">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800">Job Moderation ({jobs.length} Listings)</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 text-[11px] font-extrabold uppercase tracking-wider border-b border-slate-200">
                      <th className="py-4 px-6">Title & Category</th>
                      <th className="py-4 px-6">Posted By / Company</th>
                      <th className="py-4 px-6">Type & Location</th>
                      <th className="py-4 px-6">Applications</th>
                      <th className="py-4 px-6 text-right">Moderation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
                    {jobs.map((job) => (
                      <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-900">{job.title}</div>
                          <div className="text-xs text-slate-400">{new Date(job.created_at).toLocaleDateString()}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-slate-900 text-xs font-bold">{job.company_name || 'Individual'}</div>
                          <div className="text-slate-500 text-xs">{job.employer_email}</div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-700 border border-slate-200">
                            {job.job_type}
                          </span>
                          <div className="text-xs text-slate-500 mt-0.5">{job.location}</div>
                        </td>
                        <td className="py-4 px-6 font-bold text-slate-800">{job.total_applications || 0}</td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleDeleteFakeJob(job.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 flex items-center space-x-1.5 ml-auto transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Fake Job</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Users Tab View */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-200">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-sm font-bold text-slate-800">
                  User Status & Control ({filteredUsers.length} of {users.length} Users)
                </h3>
              </div>

              {/* User search & dropdown filters */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Search name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 focus:bg-white"
                />
                
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="all">All Roles</option>
                  <option value="job_seeker">Job Seeker</option>
                  <option value="employer">Employer</option>
                  <option value="admin">Admin</option>
                </select>

                <select
                  value={userStatusFilter}
                  onChange={(e) => setUserStatusFilter(e.target.value)}
                  className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 text-[11px] font-extrabold uppercase tracking-wider border-b border-slate-200">
                      <th className="py-4 px-6">Name & Email</th>
                      <th className="py-4 px-6">Account Role</th>
                      <th className="py-4 px-6">Phone</th>
                      <th className="py-4 px-6">Account Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-900">{u.full_name}</div>
                          <div className="text-xs text-slate-500">{u.email}</div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="uppercase text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            {u.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-500">{u.phone || 'N/A'}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                            u.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          {u.role !== 'admin' && (
                            <button
                              onClick={() => handleToggleUserStatus(u.id, u.status)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                                u.status === 'active'
                                  ? 'text-amber-800 bg-amber-50 hover:bg-amber-100 border-amber-200'
                                  : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
                              }`}
                            >
                              {u.status === 'active' ? 'Suspend User' : 'Reinstate User'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Manage Categories View */}
          {activeTab === 'categories' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">Job Categories ({categories.length})</h3>
                <button
                  onClick={() => {
                    setEditingCategory(null);
                    setCatName('');
                    setCatDesc('');
                    setShowCatModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 text-[11px] font-extrabold uppercase tracking-wider border-b border-slate-200">
                        <th className="py-4 px-6">Category Name</th>
                        <th className="py-4 px-6">Slug identifier</th>
                        <th className="py-4 px-6">Description</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
                      {categories.map((cat) => (
                        <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-6 font-bold text-slate-900">{cat.name}</td>
                          <td className="py-4 px-6 text-xs text-slate-400 font-mono">{cat.slug}</td>
                          <td className="py-4 px-6 text-slate-500 text-xs max-w-sm truncate">{cat.description || 'No description provided'}</td>
                          <td className="py-4 px-6 text-right flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleEditClick(cat)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 border border-blue-100 rounded-lg transition-colors"
                              title="Edit Category"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat.id)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 border border-rose-100 rounded-lg transition-colors"
                              title="Delete Category"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* System Analytics Tab View */}
          {activeTab === 'analytics' && telemetry && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Detailed Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-3xl border border-blue-100 shadow-sm space-y-1">
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest block">Job Seekers</span>
                  <div className="text-3xl font-black text-slate-900">{telemetry.metrics.totalSeekers}</div>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-3xl border border-indigo-100 shadow-sm space-y-1">
                  <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest block">Employers</span>
                  <div className="text-3xl font-black text-slate-900">{telemetry.metrics.totalEmployers}</div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-3xl border border-amber-100 shadow-sm space-y-1">
                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest block">Jobs Published</span>
                  <div className="text-3xl font-black text-slate-900">{telemetry.metrics.totalJobs}</div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-1">
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block">Applications Sent</span>
                  <div className="text-3xl font-black text-slate-900">{telemetry.metrics.totalApplications}</div>
                </div>
              </div>

              {/* Charts Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <MiniLineChart
                  data={telemetry.trends}
                  dataKey="signups"
                  color="#2563eb"
                  title="Daily New Registrations"
                />
                
                <MiniLineChart
                  data={telemetry.trends}
                  dataKey="jobs"
                  color="#d97706"
                  title="Daily Jobs Posted"
                />

                <div className="lg:col-span-2">
                  <MiniLineChart
                    data={telemetry.trends}
                    dataKey="applications"
                    color="#059669"
                    title="Daily Applications Submitted"
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Category Creation / Edit Modal */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => {
                setShowCatModal(false);
                setEditingCategory(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900">
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </h3>
            <p className="text-xs text-slate-500">
              Configure job classification categories accessible by employers posting jobs.
            </p>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. DevOps Engineering"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="Describe roles in this classification category..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white resize-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCatModal(false);
                    setEditingCategory(null);
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingCat}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                >
                  {submittingCat ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
