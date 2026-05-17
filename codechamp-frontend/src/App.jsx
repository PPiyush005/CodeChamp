import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import DSAPage from './pages/dsa/DSAPage';
import TopicsPage from './pages/dsa/TopicsPage';
import BookmarksPage from './pages/dsa/BookmarksPage';
import RevisionPage from './pages/dsa/RevisionPage';
import Blind75Page from './pages/dsa/Blind75Page';
import RoadmapPage from './pages/roadmap/RoadmapPage';
import RoadmapDetailPage from './pages/roadmap/RoadmapDetailPage';
import ProfilePage from './pages/profile/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#ffffff',
              color: '#1a202c',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              fontSize: '0.875rem',
              fontWeight: '500'
            },
            success: {
              iconTheme: {
                primary: '#16a34a',
                secondary: '#ffffff'
              }
            },
            error: {
              iconTheme: {
                primary: '#dc2626',
                secondary: '#ffffff'
              }
            }
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/dsa" element={
            <ProtectedRoute><DSAPage /></ProtectedRoute>
          } />
          <Route path="/topics" element={
            <ProtectedRoute><TopicsPage /></ProtectedRoute>
          } />
          <Route path="/bookmarks" element={
            <ProtectedRoute><BookmarksPage /></ProtectedRoute>
          } />
          <Route path="/revision" element={
            <ProtectedRoute><RevisionPage /></ProtectedRoute>
          } />
          <Route path="/blind75" element={
            <ProtectedRoute><Blind75Page /></ProtectedRoute>
          } />
          <Route path="/roadmap" element={
            <ProtectedRoute><RoadmapPage /></ProtectedRoute>
          } />
          <Route path="/roadmap/:trackId" element={
            <ProtectedRoute><RoadmapDetailPage /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />
          <Route path="/" element={
            <Navigate to="/dashboard" replace />
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;