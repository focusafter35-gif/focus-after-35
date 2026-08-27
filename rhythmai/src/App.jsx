import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import AuthPage from './pages/AuthPage.jsx'
import OnboardingPage from './pages/OnboardingPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import GoalsPage from './pages/GoalsPage.jsx'
import PlanPage from './pages/PlanPage.jsx'
import ResearchPage from './pages/ResearchPage.jsx'
import ReportPage from './pages/ReportPage.jsx'
import WorkPage from './pages/WorkPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import { db } from './lib/db.js'
import { useAuth } from './auth/AuthContext.jsx'

function FullScreenLoading() {
  return <div className="min-h-screen flex items-center justify-center bg-bg text-muted">…</div>
}

// In local-only mode (no Supabase project configured) there is no login
// concept at all, so this is a no-op and the app behaves exactly as before.
function RequireAuth({ children }) {
  const { configured, user, loading } = useAuth()
  if (!configured) return children
  if (loading) return <FullScreenLoading />
  if (!user) return <Navigate to="/login" replace />
  return children
}

function RequireProfile({ children }) {
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let cancelled = false
    db.hasProfile().then((has) => {
      if (!cancelled) setStatus(has ? 'complete' : 'incomplete')
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (status === 'loading') return <FullScreenLoading />
  if (status === 'incomplete') return <Navigate to="/welcome" replace />
  return children
}

function LoginRoute() {
  const { configured } = useAuth()
  if (!configured) return <Navigate to="/" replace />
  return <AuthPage />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginRoute />} />
      <Route
        path="/welcome"
        element={
          <RequireAuth>
            <OnboardingPage />
          </RequireAuth>
        }
      />
      <Route element={<Layout />}>
        <Route
          path="/"
          element={
            <RequireAuth>
              <RequireProfile>
                <DashboardPage />
              </RequireProfile>
            </RequireAuth>
          }
        />
        <Route
          path="/goals"
          element={
            <RequireAuth>
              <RequireProfile>
                <GoalsPage />
              </RequireProfile>
            </RequireAuth>
          }
        />
        <Route
          path="/plan"
          element={
            <RequireAuth>
              <RequireProfile>
                <PlanPage />
              </RequireProfile>
            </RequireAuth>
          }
        />
        <Route
          path="/research"
          element={
            <RequireAuth>
              <RequireProfile>
                <ResearchPage />
              </RequireProfile>
            </RequireAuth>
          }
        />
        <Route
          path="/report"
          element={
            <RequireAuth>
              <RequireProfile>
                <ReportPage />
              </RequireProfile>
            </RequireAuth>
          }
        />
        <Route
          path="/work"
          element={
            <RequireAuth>
              <RequireProfile>
                <WorkPage />
              </RequireProfile>
            </RequireAuth>
          }
        />
        <Route
          path="/settings"
          element={
            <RequireAuth>
              <SettingsPage />
            </RequireAuth>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
