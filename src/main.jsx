import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import AuthHashGuard from './components/AuthHashGuard'
import App from './App.jsx'
import FindSpeakersPage from './components/FindSpeakersPage.jsx'
import SpeakerProfile from './components/SpeakerProfile.jsx'
import { ToastProvider } from './components/Toast'
import BlogPost from './site/blog/BlogPost'
import BlogIndex from './site/blog/BlogIndex'
import Insights from './site/blog/Insights'
import AdminBlogList from './admin/blog/AdminBlogList'
import AdminBlogEditor from './admin/blog/AdminBlogEditor'
import PublicLayout from './site/layout/PublicLayout'
import SignIn from './pages/SignIn'
import AuthCallback from './pages/AuthCallback'
import SpeakerDashboard from './pages/speaker/SpeakerDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import AdminHashRedirect from './pages/AdminHashRedirect'
import AdminHashGate from './components/AdminHashGate'
import { AuthProvider } from './providers/AuthProvider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <AuthProvider>
        <AdminHashGate />
        <Router>
          <AuthHashGuard />
          <ScrollToTop />
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/speakers/:slug" element={<SpeakerProfile />} />
              <Route path="/find-speakers" element={<FindSpeakersPage />} />
              <Route path="/book-a-speaker" element={<App />} />
              {/* New canonical route for card-based application */}
              <Route path="/apply-card-v1" element={<App />} />
              {/* Back-compat: old beta path redirects to new */}
              <Route path="/apply-beta" element={<Navigate to="/apply-card-v1" replace />} />
              {/* Keep existing v2 route as-is */}
              <Route path="/apply-v2" element={<App />} />
              <Route path="/blog" element={<BlogIndex />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/*" element={<App />} />
            </Route>
            {/* Speaker Portal (new paths) */}
            <Route path="/speaker/signin" element={<SignIn />} />
            <Route path="/speaker/auth/callback" element={<AuthCallback />} />
            <Route
              path="/speaker/admin"
              element={
                <ProtectedRoute>
                  <SpeakerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Back-compat redirects from old paths */}
            <Route path="/signin" element={<Navigate to="/speaker/signin" replace />} />
            <Route path="/auth/callback" element={<Navigate to="/speaker/auth/callback" replace />} />

            {/* Admin hash redirect */}
            <Route path="/admin" element={<AdminHashRedirect />} />

            <Route path="/admin/blog" element={<AdminBlogList />} />
            <Route path="/admin/blog/new" element={<AdminBlogEditor />} />
            <Route path="/admin/blog/:id" element={<AdminBlogEditor />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ToastProvider>
  </StrictMode>,
)
