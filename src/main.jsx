import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App.jsx'
import FindSpeakersPage from './components/FindSpeakersPage.jsx'
import SpeakerProfile from './pages/SpeakerProfile.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/speaker/:id" element={<SpeakerProfile />} />
        <Route path="/find" element={<FindSpeakersPage />} />
        <Route path="/speakers" element={<Navigate to="/find" replace />} />
        <Route path="/find-speakers" element={<Navigate to="/find" replace />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
