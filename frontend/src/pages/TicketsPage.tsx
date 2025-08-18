import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TicketCard } from '@/components/TicketCard';
import { QuickTicketForm } from '@/components/QuickTicketForm';
import { useTicketStore } from '@/stores/ticketStore';
import { Ticket } from '@/types/ticket';

export const TicketsPage: React.FC = () => {
  const { tickets, fetchTickets, loading, error } = useTicketStore();
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showQuickForm, setShowQuickForm] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    let filtered = tickets;

    // Фильтр по поиску
    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Фильтр по статусу
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    // Фильтр по приоритету
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }

    setFilteredTickets(filtered);
  }, [tickets, searchTerm, statusFilter, priorityFilter]);

  const statusOptions = [
    { value: 'all', label: 'Все статусы', icon: '📋' },
    { value: 'new', label: 'Новые', icon: '🆕' },
    { value: 'assigned', label: 'Назначенные', icon: '👤' },
    { value: 'in_progress', label: 'В работе', icon: '⚡' },
    { value: 'on_hold', label: 'На паузе', icon: '⏸️' },
    { value: 'resolved', label: 'Решенные', icon: '✅' },
    { value: 'closed', label: 'Закрытые', icon: '🔒' },
  ];

  const priorityOptions = [
    { value: 'all', label: 'Все приоритеты', icon: '🎯' },
    { value: 'low', label: 'Низкие', icon: '🟢' },
    { value: 'medium', label: 'Средние', icon: '🟡' },
    { value: 'high', label: 'Высокие', icon: '🟠' },
    { value: 'critical', label: 'Критические', icon: '🔴' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center apple-container">
        <div className="apple-card p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 mx-auto mb-4" 
               style={{ 
                 borderTop: `2px solid var(--system-blue)`,
                 borderRight: '2px solid transparent',
                 borderBottom: '2px solid transparent',
                 borderLeft: '2px solid transparent'
               }}></div>
          <p className="apple-text-body" style={{ color: 'var(--label-secondary)' }}>
            Загружаем заявки...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center apple-container">
        <div className="apple-card p-8 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="apple-text-large-title mb-2" style={{ color: 'var(--label-primary)' }}>
            Ошибка загрузки
          </h2>
          <p className="apple-text-body mb-4" style={{ color: 'var(--label-secondary)' }}>
            {error}
          </p>
          <button
            onClick={fetchTickets}
            className="apple-button-primary"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="apple-container space-y-6">
      {/* Заголовок страницы */}
      <div className="text-center space-y-3">
        <h1 className="apple-text-title" style={{ color: 'var(--label-primary)' }}>
          Заявки
        </h1>
        <p className="apple-text-body" style={{ color: 'var(--label-secondary)' }}>
          Отслеживайте статус заявок и управляйте задачами парка
        </p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="apple-card p-4 text-center">
          <div className="text-2xl font-bold mb-1" style={{ color: 'var(--system-blue)' }}>
            {tickets.length}
          </div>
          <div className="apple-text-caption" style={{ color: 'var(--label-secondary)' }}>
            Всего заявок
          </div>
        </div>
        <div className="apple-card p-4 text-center">
          <div className="text-2xl font-bold mb-1" style={{ color: 'var(--system-green)' }}>
            {tickets.filter(t => t.status === 'new').length}
          </div>
          <div className="apple-text-caption" style={{ color: 'var(--label-secondary)' }}>
            Новых
          </div>
        </div>
        <div className="apple-card p-4 text-center">
          <div className="text-2xl font-bold mb-1" style={{ color: 'var(--system-orange)' }}>
            {tickets.filter(t => t.status === 'in_progress').length}
          </div>
          <div className="apple-text-caption" style={{ color: 'var(--label-secondary)' }}>
            В работе
          </div>
        </div>
        <div className="apple-card p-4 text-center">
          <div className="text-2xl font-bold mb-1" style={{ color: 'var(--system-purple)' }}>
            {tickets.filter(t => t.status === 'resolved').length}
          </div>
          <div className="apple-text-caption" style={{ color: 'var(--label-secondary)' }}>
            Решенных
          </div>
        </div>
      </div>

      {/* Панель управления */}
      <div className="glass-card p-6 space-y-4">
        {/* Поиск */}
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Поиск по заявкам..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-12 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
        </div>

        {/* Фильтры */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Фильтр по статусу */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Статус
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Фильтр по приоритету */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Приоритет
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Кнопки создания */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setShowQuickForm(true)}
            className="apple-button-primary flex items-center space-x-2"
          >
            <span>⚡</span>
            <span>Быстрая заявка</span>
          </button>
          
          <Link
            to="/create"
            className="apple-button-secondary flex items-center space-x-2"
          >
            <span>📝</span>
            <span>Подробная форма</span>
          </Link>
        </div>
      </div>

      {/* Список заявок */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Заявки ({filteredTickets.length})
          </h2>
          {filteredTickets.length === 0 && tickets.length > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Нет заявок по выбранным фильтрам
            </p>
          )}
        </div>

        {filteredTickets.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {tickets.length === 0 ? 'Заявок пока нет' : 'Заявки не найдены'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {tickets.length === 0 
                ? 'Создайте первую заявку для начала работы'
                : 'Попробуйте изменить параметры поиска или фильтры'
              }
            </p>
            {tickets.length === 0 && (
              <Link to="/create" className="gradient-button">
                Создать первую заявку
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </div>

      {/* Быстрая форма создания заявки */}
      {showQuickForm && (
        <QuickTicketForm
          onClose={() => setShowQuickForm(false)}
          onSuccess={() => {
            setShowQuickForm(false);
            fetchTickets(); // Обновляем список заявок
          }}
        />
      )}
    </div>
  );
};
