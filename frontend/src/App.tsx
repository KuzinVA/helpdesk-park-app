import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TicketsPage from './pages/TicketsPage';
import CreateTicketPage from './pages/CreateTicketPage';
import TicketDetailPage from './pages/TicketDetailPage';
import ProfilePage from './pages/ProfilePage';
import StatsPage from './pages/StatsPage';
import NotificationProvider from './components/NotificationProvider';

// 🎨 Mobile-first App с Apple-style дизайном
const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <NotificationProvider>
      <Router>
        <div className="App bg-system-background min-h-screen">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
            />
            
            {/* Protected Routes */}
            <Route 
              path="/" 
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} 
            />
            
            <Route 
              path="/dashboard" 
              element={
                isAuthenticated ? (
                  <Layout>
                    <DashboardPage />
                  </Layout>
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            
            <Route 
              path="/tickets" 
              element={
                isAuthenticated ? (
                  <Layout>
                    <TicketsPage />
                  </Layout>
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            
            <Route 
              path="/tickets/create" 
              element={
                isAuthenticated ? (
                  <Layout>
                    <CreateTicketPage />
                  </Layout>
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            
            <Route 
              path="/tickets/:id" 
              element={
                isAuthenticated ? (
                  <Layout>
                    <TicketDetailPage />
                  </Layout>
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            
            <Route 
              path="/profile" 
              element={
                isAuthenticated ? (
                  <Layout>
                    <ProfilePage />
                  </Layout>
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            
            <Route 
              path="/stats" 
              element={
                isAuthenticated ? (
                  <Layout>
                    <StatsPage />
                  </Layout>
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            
            {/* Fallback */}
            <Route 
              path="*" 
              element={<Navigate to="/dashboard" replace />} 
            />
          </Routes>
        </div>
      </Router>
    </NotificationProvider>
  );
};

export default App;
