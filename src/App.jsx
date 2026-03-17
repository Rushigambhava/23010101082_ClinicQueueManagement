import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './core/context/AuthContext'
import ProtectedRoute from './ui/components/ProtectedRoutes'
import Layout from './ui/layout/Layout'

// Pages
import Login from './screens/login'
import Dashboard from './screens/Dashboard'
import AdminClinicInfo from './screens/admin/AdminClinicInfo'
import AdminUsers from './screens/admin/AdminUsers'
import PatientAppointments from './screens/patient/PatientAppointments'
import BookAppointment from './screens/patient/BookAppointment'
import AppointmentDetail from './screens/patient/AppointmentDetail'
import PatientPrescriptions from './screens/patient/PatientPrescriptions'
import PatientReports from './screens/patient/PatientReports'
import ReceptionistQueue from './screens/receptionist/ReceptionistQueue'
import DoctorQueue from './screens/doctor/DoctorQueue'
import AddPrescription from './screens/doctor/AddPrescription'
import AddReport from './screens/doctor/AddReport'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes with layout */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            {/* Dashboard — all roles */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Admin */}
            <Route path="/admin/clinic" element={<ProtectedRoute allowedRoles={["admin"]}><AdminClinicInfo /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["admin"]}><AdminUsers /></ProtectedRoute>} />

            {/* Patient */}
            <Route path="/appointments" element={<ProtectedRoute allowedRoles={["patient"]}><PatientAppointments /></ProtectedRoute>} />
            <Route path="/appointments/book" element={<ProtectedRoute allowedRoles={["patient"]}><BookAppointment /></ProtectedRoute>} />
            <Route path="/appointments/:id" element={<ProtectedRoute allowedRoles={["patient"]}><AppointmentDetail /></ProtectedRoute>} />
            <Route path="/prescriptions" element={<ProtectedRoute allowedRoles={["patient"]}><PatientPrescriptions /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute allowedRoles={["patient"]}><PatientReports /></ProtectedRoute>} />

            {/* Receptionist */}
            <Route path="/queue" element={<ProtectedRoute allowedRoles={["receptionist"]}><ReceptionistQueue /></ProtectedRoute>} />

            {/* Doctor */}
            <Route path="/doctor/queue" element={<ProtectedRoute allowedRoles={["doctor"]}><DoctorQueue /></ProtectedRoute>} />
            <Route path="/doctor/prescriptions/:appointmentId" element={<ProtectedRoute allowedRoles={["doctor"]}><AddPrescription /></ProtectedRoute>} />
            <Route path="/doctor/reports/:appointmentId" element={<ProtectedRoute allowedRoles={["doctor"]}><AddReport /></ProtectedRoute>} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
