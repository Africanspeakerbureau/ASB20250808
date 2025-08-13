import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import App from './App.jsx'
import FindSpeakersPage from './components/FindSpeakersPage.jsx'
import SpeakerProfile from './components/SpeakerProfile.jsx'
import { ToastProvider } from './components/Toast'
import Footer from './components/Footer.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/speakers/:slug" element={<SpeakerProfile />} />
          <Route path="/find" element={<FindSpeakersPage />} />
          <Route path="/book" element={<App />} />
          <Route path="/*" element={<App />} />
        </Routes>
        {/* Global footer for all routes */}
        <Footer />
      </Router>
    </ToastProvider>
  </StrictMode>,
)
