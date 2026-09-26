import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/public/HomePage';
import { LoginPage } from './pages/admin/LoginPage';
import { ResetPasswordPage } from './pages/admin/ResetPasswordPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { DashboardPage } from './pages/admin/DashboardPage';
import { ProfileAdminPage } from './pages/admin/ProfileAdminPage';
import { HeroAdminPage } from './pages/admin/HeroAdminPage';
import { ProjectsAdminPage } from './pages/admin/ProjectsAdminPage';
import { SkillsAdminPage } from './pages/admin/SkillsAdminPage';
import { CertificationsAdminPage } from './pages/admin/CertificationsAdminPage';
import { EducationAdminPage } from './pages/admin/EducationAdminPage';
import { ExperienceAdminPage } from './pages/admin/ExperienceAdminPage';
import { ResearchAdminPage } from './pages/admin/ResearchAdminPage';
import { NavigationAdminPage } from './pages/admin/NavigationAdminPage';
import { MediaAdminPage } from './pages/admin/MediaAdminPage';
import { DocumentsAdminPage } from './pages/admin/DocumentsAdminPage';
import { MessagesAdminPage } from './pages/admin/MessagesAdminPage';
import { SettingsAdminPage } from './pages/admin/SettingsAdminPage';

export function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin/forgot-password" element={<LoginPage />} />
      <Route path="/admin/reset-password" element={<ResetPasswordPage />} />

      {/* Admin Protected Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="profile" element={<ProfileAdminPage />} />
        <Route path="hero" element={<HeroAdminPage />} />
        <Route path="projects" element={<ProjectsAdminPage />} />
        <Route path="skills" element={<SkillsAdminPage />} />
        <Route path="certifications" element={<CertificationsAdminPage />} />
        <Route path="education" element={<EducationAdminPage />} />
        <Route path="experience" element={<ExperienceAdminPage />} />
        <Route path="research" element={<ResearchAdminPage />} />
        <Route path="navigation" element={<NavigationAdminPage />} />
        <Route path="media" element={<MediaAdminPage />} />
        <Route path="documents" element={<DocumentsAdminPage />} />
        <Route path="messages" element={<MessagesAdminPage />} />
        <Route path="settings" element={<SettingsAdminPage />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
