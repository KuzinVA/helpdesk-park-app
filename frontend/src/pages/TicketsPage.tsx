import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { TicketCard } from '@/components/TicketCard';
import { Ticket, TicketStatus } from '@/types';

export const TicketsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'closed' | 'all'>('active');
  
  // TODO: Загружать данные с backend
  const tickets: Ticket[] = [];

  const filteredTickets = tickets.filter(ticket => {
    if (activeTab === 'active') {
      return !['RESOLVED', 'CLOSED'].includes(ticket.status);
    }
    if (activeTab === 'closed') {
      return ['RESOLVED', 'CLOSED'].includes(ticket.status);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Заявки</h1>
        <Link
          to="/create"
          className="btn-primary flex items-center space-x-2"
        >
                      <Plus className="h-5 w-5" />
          <span>Создать заявку</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'active', label: 'Активные', count: tickets.filter(t => !['RESOLVED', 'CLOSED'].includes(t.status)).length },
            { id: 'closed', label: 'Закрытые', count: tickets.filter(t => ['RESOLVED', 'CLOSED'].includes(t.status)).length },
            { id: 'all', label: 'Все', count: tickets.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tickets list */}
      {filteredTickets.length > 0 ? (
        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <Plus className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Нет заявок
          </h3>
          <p className="text-gray-500 mb-6">
            {activeTab === 'active' 
              ? 'Создайте первую заявку для начала работы'
              : 'Закрытых заявок пока нет'
            }
          </p>
          {activeTab === 'active' && (
            <Link to="/create" className="btn-primary">
              Создать заявку
            </Link>
          )}
        </div>
      )}
    </div>
  );
};
