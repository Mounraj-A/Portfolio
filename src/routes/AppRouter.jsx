import { Navigate, Route, Routes } from 'react-router-dom'
import App from '../App.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

import AdminLoginPage from '../admin/pages/AdminLoginPage.jsx'
import AdminLayout from '../admin/layouts/AdminLayout.jsx'
import AdminDashboardPage from '../admin/pages/AdminDashboardPage.jsx'
import AdminPlaceholderPage from '../admin/pages/AdminPlaceholderPage.jsx'
import AdminSettingsPage from '../admin/pages/AdminSettingsPage.jsx'
import AdminProjectsPage from '../admin/pages/AdminProjectsPage.jsx'
import AdminCertificatesPage from '../admin/pages/AdminCertificatesPage.jsx'
import AdminSkillsPage from '../admin/pages/AdminSkillsPage.jsx'
import AdminAboutPage from '../admin/pages/AdminAboutPage.jsx'
import AdminResumePage from '../admin/pages/AdminResumePage.jsx'
import AdminContactPage from '../admin/pages/AdminContactPage.jsx'
import AdminServicesPage from '../admin/pages/AdminServicesPage.jsx'
import AdminAchievementsPage from '../admin/pages/AdminAchievementsPage.jsx'
import AdminTimelinePage from '../admin/pages/AdminTimelinePage.jsx'

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<App />} />

      <Route path="/admin-login" element={<AdminLoginPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="projects" element={<AdminProjectsPage />} />
        <Route path="certificates" element={<AdminCertificatesPage />} />
        <Route path="skills" element={<AdminSkillsPage />} />
        <Route path="about" element={<AdminAboutPage />} />
        <Route path="resume" element={<AdminResumePage />} />
        <Route path="contact" element={<AdminContactPage />} />
        <Route path="services" element={<AdminServicesPage />} />
        <Route path="achievements" element={<AdminAchievementsPage />} />
        <Route path="timeline" element={<AdminTimelinePage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
