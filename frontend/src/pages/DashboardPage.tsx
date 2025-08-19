import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useTelegram } from '../hooks/useTelegram';

// 🎨 Mobile-first Dashboard с Apple-style дизайном
const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { hapticFeedback } = useTelegram();

  const handleNavigation = (path: string) => {
    if (hapticFeedback) {
      hapticFeedback.impactOccurred('light');
    }
    navigate(path);
  };

  // Mock data for demonstration
  const stats = [
    { label: 'Новые', value: '3', color: 'system-blue', icon: '🆕' },
    { label: 'В работе', value: '5', color: 'system-orange', icon: '⚡' },
    { label: 'Решено', value: '12', color: 'system-green', icon: '✅' },
    { label: 'Всего', value: '20', color: 'label-primary', icon: '📊' },
  ];

  const recentTickets = [
    {
      id: '1',
      title: 'Проблема с доступом к системе',
      description: 'Пользователи не могут войти в систему',
      status: 'new',
      priority: 'high',
      assignee: 'Иван Петров',
      createdAt: '2 часа назад',
    },
    {
      id: '2',
      title: 'Добавить новый отчет',
      description: 'Нужен отчет по продажам за месяц',
      status: 'in-progress',
      priority: 'medium',
      assignee: 'Мария Сидорова',
      createdAt: '4 часа назад',
    },
    {
      id: '3',
      title: 'Ошибка в расчете скидок',
      description: 'Неправильно считаются скидки для VIP клиентов',
      status: 'resolved',
      priority: 'critical',
      assignee: 'Алексей Козлов',
      createdAt: '1 день назад',
    },
  ];

  const myTickets = [
    {
      id: '4',
      title: 'Обновить интерфейс',
      description: 'Модернизировать главную страницу',
      status: 'in-progress',
      priority: 'medium',
      dueDate: 'Завтра',
    },
  ];

  return (
    <div className="container mobile-padding space-y-6">
      {/* Welcome Section */}
      <div className="text-center space-y-2">
        <h1 className="apple-text-title-1 text-label-primary">
          Добрый день, {user?.firstName}! 👋
        </h1>
        <p className="apple-text-body text-label-secondary">
          Вот что происходит с вашими заявками сегодня
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="mobile-grid">
        {stats.map((stat, index) => (
          <div key={index} className="apple-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="apple-text-caption-1 text-label-tertiary mb-1">
                  {stat.label}
                </p>
                <p className={`apple-text-title-2 font-bold text-${stat.color}`}>
                  {stat.value}
                </p>
              </div>
              <div className="text-2xl">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h2 className="apple-text-headline text-label-primary">Быстрые действия</h2>
        <div className="mobile-grid">
          <button
            onClick={() => handleNavigation('/tickets/create')}
            className="apple-card p-4 text-left hover:scale-105 apple-transition"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-system-blue/10 rounded-full flex items-center justify-center">
                <span className="text-system-blue text-xl">+</span>
              </div>
              <div>
                <h3 className="apple-text-headline text-label-primary">Создать заявку</h3>
                <p className="apple-text-caption-1 text-label-tertiary">Новая задача</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleNavigation('/tickets')}
            className="apple-card p-4 text-left hover:scale-105 apple-transition"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-system-green/10 rounded-full flex items-center justify-center">
                <span className="text-system-green text-xl">📋</span>
              </div>
              <div>
                <h3 className="apple-text-headline text-label-primary">Все заявки</h3>
                <p className="apple-text-caption-1 text-label-tertiary">Просмотр списка</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Tickets */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="apple-text-headline text-label-primary">Последние заявки</h2>
          <button
            onClick={() => handleNavigation('/tickets')}
            className="apple-text-callout text-system-blue"
          >
            Все →
          </button>
        </div>
        
        <div className="space-y-3">
          {recentTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => handleNavigation(`/tickets/${ticket.id}`)}
              className="apple-card p-4 cursor-pointer hover:scale-105 apple-transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <h3 className="apple-text-headline text-label-primary">
                    {ticket.title}
                  </h3>
                  <p className="apple-text-caption-1 text-label-secondary line-clamp-2">
                    {ticket.description}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className={`status-badge status-${ticket.status}`}>
                      {ticket.status === 'new' && 'Новый'}
                      {ticket.status === 'in-progress' && 'В работе'}
                      {ticket.status === 'resolved' && 'Решено'}
                    </span>
                    <span className={`priority-badge priority-${ticket.priority}`}>
                      {ticket.priority === 'high' && 'Высокий'}
                      {ticket.priority === 'medium' && 'Средний'}
                      {ticket.priority === 'critical' && 'Критический'}
                    </span>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="apple-text-caption-2 text-label-tertiary">
                    {ticket.createdAt}
                  </p>
                  {ticket.assignee && (
                    <p className="apple-text-caption-2 text-label-secondary">
                      {ticket.assignee}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Tickets */}
      <div className="space-y-3">
        <h2 className="apple-text-headline text-label-primary">Мои заявки</h2>
        
        <div className="space-y-3">
          {myTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => handleNavigation(`/tickets/${ticket.id}`)}
              className="apple-card p-4 cursor-pointer hover:scale-105 apple-transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <h3 className="apple-text-headline text-label-primary">
                    {ticket.title}
                  </h3>
                  <p className="apple-text-caption-1 text-label-secondary line-clamp-2">
                    {ticket.description}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className={`status-badge status-${ticket.status}`}>
                      {ticket.status === 'in-progress' && 'В работе'}
                    </span>
                    <span className={`priority-badge priority-${ticket.priority}`}>
                      {ticket.priority === 'medium' && 'Средний'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="apple-text-caption-2 text-label-tertiary">
                    {ticket.dueDate}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Activity */}
      <div className="space-y-3">
        <h2 className="apple-text-headline text-label-primary">Активность команды</h2>
        
        <div className="apple-card p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="apple-text-body text-label-primary">Сегодня</span>
              <span className="apple-text-caption-1 text-label-tertiary">5 заявок</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-system-blue/10 rounded-full flex items-center justify-center">
                  <span className="text-system-blue text-sm">👤</span>
                </div>
                <div className="flex-1">
                  <p className="apple-text-caption-1 text-label-primary">
                    Иван Петров создал заявку
                  </p>
                  <p className="apple-text-caption-2 text-label-tertiary">
                    2 часа назад
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-system-green/10 rounded-full flex items-center justify-center">
                  <span className="text-system-green text-sm">✅</span>
                </div>
                <div className="flex-1">
                  <p className="apple-text-caption-1 text-label-primary">
                    Мария Сидорова решила заявку
                  </p>
                  <p className="apple-text-caption-2 text-label-tertiary">
                    4 часа назад
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
