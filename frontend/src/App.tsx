import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useTelegram } from '@/hooks/useTelegram';
import { Layout } from '@/components/Layout';
import { LoginPage } from '@/pages/LoginPage';
import { TicketsPage } from '@/pages/TicketsPage';
import { TicketDetailPage } from '@/pages/TicketDetailPage';
import { CreateTicketPage } from '@/pages/CreateTicketPage';
import { StatsPage } from '@/pages/StatsPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { NotificationProvider } from '@/components/NotificationProvider';

function App() {
  const { isAuthenticated, initializeAuth } = useAuthStore();
  const { initTelegram } = useTelegram();

  useEffect(() => {
    initTelegram();
    initializeAuth();
  }, [initTelegram, initializeAuth]);

  if (!isAuthenticated) {
    return (
      <NotificationProvider>
        <LoginPage />
      </NotificationProvider>
    );
  }

  return (
    <NotificationProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/tickets" replace />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/tickets/:id" element={<TicketDetailPage />} />
          <Route path="/create" element={<CreateTicketPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Layout>
    </NotificationProvider>
  );
}

export default App;
