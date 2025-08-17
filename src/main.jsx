import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import App from './App.jsx'
import FindSpeakersPage from './components/FindSpeakersPage.jsx'
import SpeakerProfile from './components/SpeakerProfile.jsx'
import { ToastProvider } from './components/Toast'
import Footer from './components/Footer.jsx'
import BlogPost from '@/site/blog/BlogPost'
import AdminBlogList from './admin/blog/AdminBlogList'
import AdminBlogEditor from './admin/blog/AdminBlogEditor'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/speakers/:slug" element={<SpeakerProfile />} />
          <Route path="/find-speakers" element={<FindSpeakersPage />} />
          <Route path="/book-a-speaker" element={<App />} />
          {/* New canonical route for card-based application */}
          <Route path="/apply-card-v1" element={<App />} />
          {/* Back-compat: old beta path redirects to new */}
          <Route path="/apply-beta" element={<Navigate to="/apply-card-v1" replace />} />
          {/* Keep existing v2 route as-is */}
          <Route path="/apply-v2" element={<App />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/admin/blog" element={<AdminBlogList />} />
          <Route path="/admin/blog/new" element={<AdminBlogEditor />} />
          <Route path="/admin/blog/:id" element={<AdminBlogEditor />} />
          <Route path="/*" element={<App />} />
        </Routes>
        {/* Global footer for all routes */}
        <Footer />
      </Router>
    </ToastProvider>
  </StrictMode>,
)
