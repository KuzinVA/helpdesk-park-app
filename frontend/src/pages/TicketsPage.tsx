import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, TicketStatus, TicketPriority, UserRole } from '../types';
import TicketCard from '../components/TicketCard';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';

// Mock data для демонстрации
const mockTickets: Ticket[] = [
  {
    id: '1',
    title: 'Не работает аттракцион "Колесо обозрения"',
    description: 'Аттракцион остановился во время работы. Требуется техническое обслуживание.',
    status: TicketStatus.NEW,
    priority: TicketPriority.HIGH,
    category: 'Техническое обслуживание',
    assignedTo: {
      id: 'user1',
      telegramId: 123456789,
      firstName: 'Иван',
      lastName: 'Петров',
      role: UserRole.EXECUTOR,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    assignedToId: 'user1',
    createdBy: {
      id: 'user2',
      telegramId: 987654321,
      firstName: 'Мария',
      lastName: 'Сидорова',
      role: UserRole.EMPLOYEE,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdById: 'user2',
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-15T10:30:00'),
  },
  {
    id: '2',
    title: 'Очистка территории после праздника',
    description: 'Требуется убрать мусор и украшения после новогоднего праздника.',
    status: TicketStatus.IN_PROGRESS,
    priority: TicketPriority.MEDIUM,
    category: 'Уборка',
    assignedTo: {
      id: 'user3',
      telegramId: 555666777,
      firstName: 'Алексей',
      lastName: 'Козлов',
      role: UserRole.SERVICE_LEADER,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    assignedToId: 'user3',
    createdBy: {
      id: 'user2',
      telegramId: 987654321,
      firstName: 'Мария',
      lastName: 'Сидорова',
      role: UserRole.EMPLOYEE,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdById: 'user2',
    createdAt: new Date('2024-01-14T15:45:00'),
    updatedAt: new Date('2024-01-15T09:15:00'),
  },
  {
    id: '3',
    title: 'Пополнение запасов в кафе',
    description: 'Закончились основные продукты. Требуется закупка и пополнение склада.',
    status: TicketStatus.WAITING_FOR_CUSTOMER,
    priority: TicketPriority.LOW,
    category: 'Снабжение',
    assignedTo: {
      id: 'user4',
      telegramId: 111222333,
      firstName: 'Елена',
      lastName: 'Волкова',
      role: UserRole.SERVICE_LEADER,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    assignedToId: 'user4',
    createdBy: {
      id: 'user1',
      telegramId: 123456789,
      firstName: 'Иван',
      lastName: 'Петров',
      role: UserRole.EXECUTOR,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdById: 'user1',
    createdAt: new Date('2024-01-13T12:20:00'),
    updatedAt: new Date('2024-01-14T16:30:00'),
  },
];

const TicketsPage: React.FC = () => {
  const [tickets] = useState<Ticket[]>(mockTickets);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(mockTickets);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let filtered = tickets;

    // Фильтр по статусу
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    // Фильтр по приоритету
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }

    // Поиск по тексту
    if (searchQuery) {
      filtered = filtered.filter(ticket =>
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTickets(filtered);
  }, [tickets, statusFilter, priorityFilter, searchQuery]);

  const getStatusCount = (status: TicketStatus) => {
    return tickets.filter(ticket => ticket.status === status).length;
  };

  // const getPriorityCount = (priority: TicketPriority) => {
  //   return tickets.filter(ticket => ticket.priority === priority).length;
  // };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="apple-text-large-title text-label-primary">
            Заявки
          </h1>
          <p className="apple-text-body text-label-secondary mt-2">
            Управление заявками и задачами парка аттракционов
          </p>
        </div>
        <Link
          to="/tickets/create"
          className="apple-button-primary px-6 py-3 text-lg"
        >
          <span className="flex items-center space-x-2">
            <span>➕</span>
            <span>Создать заявку</span>
          </span>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="apple-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="apple-text-caption-1 text-label-tertiary">Всего заявок</p>
              <p className="apple-text-title-2 text-label-primary">{tickets.length}</p>
            </div>
            <div className="w-12 h-12 bg-system-blue rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">📋</span>
            </div>
          </div>
        </div>

        <div className="apple-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="apple-text-caption-1 text-label-tertiary">Новые</p>
              <p className="apple-text-title-2 text-label-primary">{getStatusCount(TicketStatus.NEW)}</p>
            </div>
            <div className="w-12 h-12 bg-system-blue rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">🆕</span>
            </div>
          </div>
        </div>

        <div className="apple-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="apple-text-caption-1 text-label-tertiary">В работе</p>
              <p className="apple-text-title-2 text-label-primary">{getStatusCount(TicketStatus.IN_PROGRESS)}</p>
            </div>
            <div className="w-12 h-12 bg-system-orange rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">⚡</span>
            </div>
          </div>
        </div>

        <div className="apple-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="apple-text-caption-1 text-label-tertiary">Решено</p>
              <p className="apple-text-title-2 text-label-primary">{getStatusCount(TicketStatus.RESOLVED)}</p>
            </div>
            <div className="w-12 h-12 bg-system-green rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">✅</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="apple-card p-4 space-y-4">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Поиск по заявкам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="apple-input w-full"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TicketStatus | 'all')}
            className="apple-input min-w-[150px]"
          >
            <option value="all">Все статусы</option>
            <option value={TicketStatus.NEW}>Новые</option>
            <option value={TicketStatus.IN_PROGRESS}>В работе</option>
            <option value={TicketStatus.WAITING_FOR_CUSTOMER}>Ожидают клиента</option>
            <option value={TicketStatus.RESOLVED}>Решены</option>
            <option value={TicketStatus.CLOSED}>Закрыты</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as TicketPriority | 'all')}
            className="apple-input min-w-[150px]"
          >
            <option value="all">Все приоритеты</option>
            <option value={TicketPriority.LOW}>Низкий</option>
            <option value={TicketPriority.MEDIUM}>Средний</option>
            <option value={TicketPriority.HIGH}>Высокий</option>
            <option value={TicketPriority.URGENT}>Срочно</option>
          </select>
        </div>

        {/* Active Filters Display */}
        {(statusFilter !== 'all' || priorityFilter !== 'all' || searchQuery) && (
          <div className="flex flex-wrap items-center space-x-2">
            <span className="apple-text-caption-1 text-label-tertiary">Активные фильтры:</span>
            {statusFilter !== 'all' && (
              <StatusBadge status={statusFilter} />
            )}
            {priorityFilter !== 'all' && (
              <PriorityBadge priority={priorityFilter} />
            )}
            {searchQuery && (
              <span className="apple-text-caption-1 bg-fill-quaternary px-2 py-1 rounded-full">
                🔍 "{searchQuery}"
              </span>
            )}
            <button
              onClick={() => {
                setStatusFilter('all');
                setPriorityFilter('all');
                setSearchQuery('');
              }}
              className="apple-text-caption-1 text-system-blue hover:underline"
            >
              Очистить все
            </button>
          </div>
        )}
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <div className="apple-card p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="apple-text-title-2 text-label-primary mb-2">
              Заявки не найдены
            </h3>
            <p className="apple-text-body text-label-secondary mb-6">
              {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'Попробуйте изменить фильтры или поисковый запрос'
                : 'Создайте первую заявку для начала работы'
              }
            </p>
            {!searchQuery && statusFilter === 'all' && priorityFilter === 'all' && (
              <Link to="/tickets/create" className="apple-button-primary">
                Создать заявку
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsPage;
