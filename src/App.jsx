import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import AdminLayout from './components/layout/AdminLayout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ArticlesPage from './pages/ArticlesPage'
import ArticleFormPage from './pages/ArticleFormPage'
import ContactsPage from './pages/ContactsPage'
import RecruitmentPage from './pages/RecruitmentPage'
import RecruitmentFormPage from './pages/RecruitmentFormPage'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex h-screen items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-brand-500 border-t-transparent rounded-full" /></div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<DashboardPage />} />
        <Route path="articles" element={<ArticlesPage />} />
        <Route path="articles/create" element={<ArticleFormPage />} />
        <Route path="articles/:id/edit" element={<ArticleFormPage />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="recruitment" element={<RecruitmentPage />} />
        <Route path="recruitment/create" element={<RecruitmentFormPage />} />
        <Route path="recruitment/:id/edit" element={<RecruitmentFormPage />} />
      </Route>
    </Routes>
  )
}
