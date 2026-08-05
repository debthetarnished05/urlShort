import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import Navbar from './components/Navbar'
import Toast from './components/Toast'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import MyUrls from './pages/MyUrls'
import Analytics from './pages/Analytics'
import Auth from './pages/Auth'

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Navbar />
        <div className="page-wrapper">
          <Routes>
            {/* Public */}
            <Route path="/auth" element={<Auth />} />

            {/* Protected */}
            <Route path="/" element={
              <ProtectedRoute><Home /></ProtectedRoute>
            } />
            <Route path="/my-urls" element={
              <ProtectedRoute><MyUrls /></ProtectedRoute>
            } />
            <Route path="/analytics/:shortId" element={
              <ProtectedRoute><Analytics /></ProtectedRoute>
            } />
          </Routes>
        </div>
        <Toast />
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
