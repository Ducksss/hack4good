import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import PatientDashboard from './pages/PatientDashboard'
import CaregiverDashboard from './pages/CaregiverDashboard'
import CameraView from './pages/CameraView'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        {/* Navigation */}
        <nav className="bg-slate-800/50 backdrop-blur-md border-b border-slate-700 px-6 py-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                AgeWell
              </span>
            </Link>
            <div className="flex gap-4">
              <Link
                to="/patient"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors text-white font-medium"
              >
                Patient View
              </Link>
              <Link
                to="/caregiver"
                className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors text-white font-medium"
              >
                Caregiver Dashboard
              </Link>
              <Link
                to="/camera"
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition-colors text-white font-medium"
              >
                Camera Feed
              </Link>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/patient" element={<PatientDashboard />} />
          <Route path="/caregiver" element={<CaregiverDashboard />} />
          <Route path="/camera" element={<CameraView />} />
        </Routes>
      </div>
    </Router>
  )
}

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Welcome to AgeWell
        </h1>
        <p className="text-xl text-slate-400 mb-8">
          Strengthening caregiver–recipient relationships through respectful, autonomy-preserving support.
        </p>
        <p className="text-lg text-slate-500 mb-12">
          Care is delivered when needed, not constantly imposed.
        </p>
        <div className="flex gap-6 justify-center">
          <Link
            to="/patient"
            className="px-8 py-4 text-xl rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all text-white font-semibold shadow-lg shadow-indigo-500/25"
          >
            I'm a Patient
          </Link>
          <Link
            to="/caregiver"
            className="px-8 py-4 text-xl rounded-2xl bg-slate-700 hover:bg-slate-600 transition-all text-white font-semibold border border-slate-600"
          >
            I'm a Caregiver
          </Link>
        </div>
      </div>
    </div>
  )
}

export default App
