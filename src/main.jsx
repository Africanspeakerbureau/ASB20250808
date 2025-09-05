import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import App from './App.jsx'
import FindSpeakersPage from './components/FindSpeakersPage.jsx'
import PublicSpeakerProfile from './components/SpeakerProfile.jsx'
import SpeakerProfile from '@/routes/SpeakerProfile'
import { ToastProvider } from './components/Toast'
import BlogPost from './site/blog/BlogPost'
import BlogIndex from './site/blog/BlogIndex'
import Insights from './site/blog/Insights'
import AdminBlogList from './admin/blog/AdminBlogList'
import AdminBlogEditor from './admin/blog/AdminBlogEditor'
import PublicLayout from './site/layout/PublicLayout'
import SpeakerLogin from './pages/speaker/SpeakerLogin.jsx'
import SpeakerCallback from './pages/speaker/SpeakerCallback.jsx'
import SpeakerDashboard from './pages/speaker/SpeakerDashboard.jsx'
import RequireSpeakerAuth from './routes/RequireSpeakerAuth.jsx'
import MagicLinkShim from './app/MagicLinkShim.jsx'
import SignOut from '@/routes/SignOut'
import BootAuth from '@/auth/BootAuth'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <Router>
        <BootAuth />
        <MagicLinkShim />
        <ScrollToTop />
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/speakers/:slug" element={<PublicSpeakerProfile />} />
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
        <Route path="/speaker-login" element={<SpeakerLogin />} />
        <Route path="/speaker-callback" element={<SpeakerCallback />} />
        <Route path="/sign-out" element={<SignOut />} />
        <Route path="/speaker-profile" element={<SpeakerProfile />} />
        <Route
          path="/speaker-dashboard"
          element={
            <RequireSpeakerAuth>
              <SpeakerDashboard />
            </RequireSpeakerAuth>
          }
        />
        <Route path="/admin/blog" element={<AdminBlogList />} />
        <Route path="/admin/blog/new" element={<AdminBlogEditor />} />
        <Route path="/admin/blog/:id" element={<AdminBlogEditor />} />
        </Routes>
      </Router>
    </ToastProvider>
  </StrictMode>,
)
