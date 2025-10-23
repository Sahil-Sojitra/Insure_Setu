import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './Contexts/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';
import Home from './Pages/Home';
import LoginPage from './Pages/LoginPage';
import AgentLayout from './Pages/Agent/AgentLayout';
import UserLayout from './Pages/User/UserLayout';
import AdminLayout from './Pages/Admin/AdminLayout';
// import MultiUserSessionTest from './Components/Test/MultiUserSessionTest';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected User Routes */}
          <Route
            path="/user/*"
            element={
              <ProtectedRoute requiredType="user">
                <UserLayout />
              </ProtectedRoute>
            }
          />

          {/* Protected Agent Routes */}
          <Route
            path="/agent/*"
            element={
              <ProtectedRoute requiredType="agent">
                <AgentLayout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requiredType="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          />

          {/* Multi-User Session Test Route (Development/Testing) */}
          {/* <Route path="/test-session" element={<MultiUserSessionTest />} /> */}

          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
