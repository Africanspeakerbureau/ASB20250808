import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import FindSpeakersPage from './components/FindSpeakersPage.jsx'
import SpeakerProfile from './components/SpeakerProfile.jsx'
import { ToastProvider } from './components/Toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/speakers/:slug" element={<SpeakerProfile />} />
          <Route path="/find-speakers" element={<FindSpeakersPage />} />
          <Route path="/book-a-speaker" element={<App />} />
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  </StrictMode>,
)
