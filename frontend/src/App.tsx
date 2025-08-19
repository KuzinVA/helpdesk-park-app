import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import TicketsPage from './pages/TicketsPage';

// Защищенный роут
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/tickets" replace /> : <LoginPage />
        } 
      />
      
      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/tickets" replace />} />
        <Route path="tickets" element={<TicketsPage />} />
        <Route path="tickets/create" element={<div>Создание заявки (в разработке)</div>} />
        <Route path="tickets/:id" element={<div>Детали заявки (в разработке)</div>} />
        <Route path="stats" element={<div>Статистика (в разработке)</div>} />
        <Route path="profile" element={<div>Профиль (в разработке)</div>} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/tickets" replace />} />
    </Routes>
  );
};

export default App;
