import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import OnboardingPage from './pages/OnboardingPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import GoalsPage from './pages/GoalsPage.jsx'
import PlanPage from './pages/PlanPage.jsx'
import ResearchPage from './pages/ResearchPage.jsx'
import ReportPage from './pages/ReportPage.jsx'
import WorkPage from './pages/WorkPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import { storage } from './lib/storage.js'

function RequireProfile({ children }) {
  if (!storage.hasProfile()) return <Navigate to="/welcome" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/welcome" element={<OnboardingPage />} />
      <Route element={<Layout />}>
        <Route
          path="/"
          element={
            <RequireProfile>
              <DashboardPage />
            </RequireProfile>
          }
        />
        <Route
          path="/goals"
          element={
            <RequireProfile>
              <GoalsPage />
            </RequireProfile>
          }
        />
        <Route
          path="/plan"
          element={
            <RequireProfile>
              <PlanPage />
            </RequireProfile>
          }
        />
        <Route
          path="/research"
          element={
            <RequireProfile>
              <ResearchPage />
            </RequireProfile>
          }
        />
        <Route
          path="/report"
          element={
            <RequireProfile>
              <ReportPage />
            </RequireProfile>
          }
        />
        <Route
          path="/work"
          element={
            <RequireProfile>
              <WorkPage />
            </RequireProfile>
          }
        />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
