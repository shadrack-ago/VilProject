import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/auth/LoginForm';
import Layout from './components/layout/Layout';
import AdminDashboard from './components/dashboard/AdminDashboard';
import StaffDashboard from './components/dashboard/StaffDashboard';
import StaffManagement from './components/staff/StaffManagement';
import ShiftManagement from './components/shifts/ShiftManagement';
import Schedule from './components/schedule/Schedule';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ShiftProvider } from './context/ShiftContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isAuthenticated } = useAuth();
  return isAuthenticated && currentUser?.role === 'admin' ? (
    <>{children}</>
  ) : (
    <Navigate to="/" />
  );
};

const AppRoutes: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginForm />;
  }
  
  return (
    <Routes>
      <Route path="/" element={
        currentUser?.role === 'admin' ? <AdminDashboard /> : <StaffDashboard />
      } />
      <Route path="/schedule" element={<Schedule />} />
      <Route
        path="/staff"
        element={
          <AdminRoute>
            <StaffManagement />
          </AdminRoute>
        }
      />
      <Route
        path="/shifts"
        element={
          <AdminRoute>
            <ShiftManagement />
          </AdminRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ShiftProvider>
          <Layout>
            <AppRoutes />
          </Layout>
        </ShiftProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;