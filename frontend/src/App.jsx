import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/layout/ProtectedRoute'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'

import StudentDashboard from './pages/student/StudentDashboard'
import StudentProfile from './pages/student/StudentProfile'
import JobFeed from './pages/student/JobFeed'
import JobDetail from './pages/student/JobDetail'
import MyApplications from './pages/student/MyApplications'
import AiCopilot from './pages/student/AiCopilot'
import StudentMessages from './pages/student/Messages'

import TpoDashboard from './pages/tpo/TpoDashboard'
import PostJob from './pages/tpo/PostJob'
import ManageJobs from './pages/tpo/ManageJobs'
import JobApplications from './pages/tpo/JobApplications'
import MasterLedger from './pages/tpo/MasterLedger'
import Broadcast from './pages/tpo/Broadcast'
import TpoMessages from './pages/tpo/Messages'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Student routes */}
      <Route path="/student/dashboard" element={<ProtectedRoute allowedRole="STUDENT"><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/profile" element={<ProtectedRoute allowedRole="STUDENT"><StudentProfile /></ProtectedRoute>} />
      <Route path="/student/jobs" element={<ProtectedRoute allowedRole="STUDENT"><JobFeed /></ProtectedRoute>} />
      <Route path="/student/jobs/:id" element={<ProtectedRoute allowedRole="STUDENT"><JobDetail /></ProtectedRoute>} />
      <Route path="/student/applications" element={<ProtectedRoute allowedRole="STUDENT"><MyApplications /></ProtectedRoute>} />
      <Route path="/student/copilot" element={<ProtectedRoute allowedRole="STUDENT"><AiCopilot /></ProtectedRoute>} />
      <Route path="/student/messages" element={<ProtectedRoute allowedRole="STUDENT"><StudentMessages /></ProtectedRoute>} />

      {/* TPO routes */}
      <Route path="/tpo/dashboard" element={<ProtectedRoute allowedRole="TPO"><TpoDashboard /></ProtectedRoute>} />
      <Route path="/tpo/post-job" element={<ProtectedRoute allowedRole="TPO"><PostJob /></ProtectedRoute>} />
      <Route path="/tpo/manage-jobs" element={<ProtectedRoute allowedRole="TPO"><ManageJobs /></ProtectedRoute>} />
      <Route path="/tpo/jobs/:jobId/applications" element={<ProtectedRoute allowedRole="TPO"><JobApplications /></ProtectedRoute>} />
      <Route path="/tpo/ledger" element={<ProtectedRoute allowedRole="TPO"><MasterLedger /></ProtectedRoute>} />
      <Route path="/tpo/broadcast" element={<ProtectedRoute allowedRole="TPO"><Broadcast /></ProtectedRoute>} />
      <Route path="/tpo/messages" element={<ProtectedRoute allowedRole="TPO"><TpoMessages /></ProtectedRoute>} />

      <Route path="*" element={<Landing />} />
    </Routes>
  )
}
