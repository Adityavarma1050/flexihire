import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

import MainLayout from './layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SearchJobsPage from './pages/SearchJobsPage';
import JobDetailPage from './pages/JobDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';
import SupportPage from './pages/SupportPage';

// Job Seeker Pages
import SeekerDashboardPage from './pages/SeekerDashboardPage';
import AppliedJobsPage from './pages/AppliedJobsPage';
import SavedJobsPage from './pages/SavedJobsPage';

// Employer Pages
import EmployerDashboardPage from './pages/EmployerDashboardPage';
import PostJobPage from './pages/PostJobPage';
import ManageJobsPage from './pages/ManageJobsPage';
import ApplicantsPage from './pages/ApplicantsPage';

// Admin Pages
import AdminDashboardPage from './pages/AdminDashboardPage';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <MainLayout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/jobs" element={<SearchJobsPage />} />
              <Route path="/jobs/:id" element={<JobDetailPage />} />

              {/* Shared Profile */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={['job_seeker', 'employer', 'admin']}>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/support"
                element={
                  <ProtectedRoute allowedRoles={['job_seeker', 'employer', 'admin']}>
                    <SupportPage />
                  </ProtectedRoute>
                }
              />

              {/* Job Seeker Routes */}
              <Route
                path="/seeker/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['job_seeker']}>
                    <SeekerDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seeker/applications"
                element={
                  <ProtectedRoute allowedRoles={['job_seeker']}>
                    <AppliedJobsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seeker/saved"
                element={
                  <ProtectedRoute allowedRoles={['job_seeker']}>
                    <SavedJobsPage />
                  </ProtectedRoute>
                }
              />

              {/* Employer Routes */}
              <Route
                path="/employer/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['employer', 'admin']}>
                    <EmployerDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employer/post-job"
                element={
                  <ProtectedRoute allowedRoles={['employer', 'admin']}>
                    <PostJobPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employer/manage-jobs"
                element={
                  <ProtectedRoute allowedRoles={['employer', 'admin']}>
                    <ManageJobsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employer/applicants"
                element={
                  <ProtectedRoute allowedRoles={['employer', 'admin']}>
                    <ApplicantsPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </MainLayout>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}
