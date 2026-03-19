import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
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

// Owner route guard
const OwnerRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="loader" /></div>
  if (!user || user.role !== 'owner') return <Navigate to="/owner/login" />
  return children
}

// Customer route guard 
const CustomerRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="loader" /></div>
  if (!user) return <Navigate to="/signup" state={{ from: location.pathname }} />
  if (user.role === 'owner') return <Navigate to="/owner" />
  return children
}

const AppContent = () => {
  const { user, loading } = useAuth()
  const isOwnerPage = window.location.pathname.startsWith('/owner')

  // Hide customer Navbar & Footer if user is owner (on any page)
  const isOwner = user?.role === 'owner'

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-cream"><div className="loader" /></div>

  return (
    <div className="min-h-screen flex flex-col">
      {!isOwnerPage && !isOwner && <Navbar />}
      <main className="flex-1">
        <Routes>
          {/* Fully public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/rate-list" element={<RateListPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />

          {/* Protected customer routes (login required) */}
          <Route path="/printing" element={<CustomerRoute><PrintingServicePage /></CustomerRoute>} />
          <Route path="/govt-forms" element={<CustomerRoute><GovtFormServicePage /></CustomerRoute>} />
          <Route path="/card-printing" element={<CustomerRoute><CardPrintingPage /></CustomerRoute>} />
          <Route path="/track" element={<CustomerRoute><TrackRequestPage /></CustomerRoute>} />
          <Route path="/receipt/:requestId" element={<CustomerRoute><ReceiptPage /></CustomerRoute>} />

          {/* Owner routes */}
          <Route path="/owner/login" element={<OwnerLoginPage />} />
          <Route path="/owner" element={<OwnerRoute><DashboardHomePage /></OwnerRoute>} />
          <Route path="/owner/requests" element={<OwnerRoute><RequestsPage /></OwnerRoute>} />
          <Route path="/owner/templates" element={<OwnerRoute><TemplateManagementPage /></OwnerRoute>} />
          <Route path="/owner/media" element={<OwnerRoute><MediaManagementPage /></OwnerRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {!isOwnerPage && !isOwner && <Footer />}
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