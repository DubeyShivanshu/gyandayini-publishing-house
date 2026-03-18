import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import Navbar from './components/common/Navbar.jsx'
import Footer from './components/common/Footer.jsx'

// User pages
import HomePage from './pages/user/HomePage.jsx'
import PrintingServicePage from './pages/user/PrintingServicePage.jsx'
import GovtFormServicePage from './pages/user/GovtFormServicePage.jsx'
import CardPrintingPage from './pages/user/CardPrintingPage.jsx'
import TrackRequestPage from './pages/user/TrackRequestPage.jsx'
import ContactPage from './pages/user/ContactPage.jsx'
import SignUpPage from './pages/user/SignUpPage.jsx'
import SignInPage from './pages/user/SignInPage.jsx'
import ReceiptPage from './pages/user/ReceiptPage.jsx'
import RateListPage from './pages/user/RateListPage.jsx'

// Owner pages
import OwnerLoginPage from './pages/owner/OwnerLoginPage.jsx'
import DashboardHomePage from './pages/owner/DashboardHomePage.jsx'
import RequestsPage from './pages/owner/RequestsPage.jsx'
import TemplateManagementPage from './pages/owner/TemplateManagementPage.jsx'
import MediaManagementPage from './pages/owner/MediaManagementPage.jsx'

const OwnerRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="loader" /></div>
  if (!user || user.role !== 'owner') return <Navigate to="/owner/login" />
  return children
}

const AppContent = () => {
  const { loading } = useAuth()
  const isOwnerPage = window.location.pathname.startsWith('/owner')
  
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-cream"><div className="loader" /></div>

  return (
    <div className="min-h-screen flex flex-col">
      {!isOwnerPage && <Navbar />}
      <main className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/printing" element={<PrintingServicePage />} />
          <Route path="/govt-forms" element={<GovtFormServicePage />} />
          <Route path="/card-printing" element={<CardPrintingPage />} />
          <Route path="/track" element={<TrackRequestPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/receipt/:requestId" element={<ReceiptPage />} />
          <Route path="/rate-list" element={<RateListPage />} />

          {/* Owner routes */}
          <Route path="/owner/login" element={<OwnerLoginPage />} />
          <Route path="/owner" element={<OwnerRoute><DashboardHomePage /></OwnerRoute>} />
          <Route path="/owner/requests" element={<OwnerRoute><RequestsPage /></OwnerRoute>} />
          <Route path="/owner/templates" element={<OwnerRoute><TemplateManagementPage /></OwnerRoute>} />
          <Route path="/owner/media" element={<OwnerRoute><MediaManagementPage /></OwnerRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {!isOwnerPage && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
