import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumeUpload from './pages/ResumeUpload';

import JobMatch from './pages/JobMatch';
import ChatBot from './components/ChatBot';
import ExportResume from './pages/ExportResume';
import MyResumes from './pages/MyResumes';
import Settings from './pages/Settings';

import { useAuth } from './context/AuthContext';

import { GoogleOAuthProvider } from '@react-oauth/google';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};
function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const content = (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/resume/upload" element={<PrivateRoute><ResumeUpload /></PrivateRoute>} />
        <Route path="/job-match" element={<PrivateRoute><JobMatch /></PrivateRoute>} />
        <Route path="/export" element={<PrivateRoute><ExportResume /></PrivateRoute>} />
        <Route path="/resumes" element={<PrivateRoute><MyResumes /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      </Routes>
      <ChatBot />
    </Router>
  );

  if (!googleClientId) {
    console.warn('VITE_GOOGLE_CLIENT_ID not found. Google login will be disabled.');
    return content;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      {content}
    </GoogleOAuthProvider>
  );
}

export default App;
