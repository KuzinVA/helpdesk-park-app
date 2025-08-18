import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket } from '@/types/ticket';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';

interface TicketCardProps {
  ticket: Ticket;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Сегодня';
    if (diffDays === 2) return 'Вчера';
    if (diffDays < 7) return `${diffDays} дня назад`;
    
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'var(--system-green)';
      case 'assigned': return 'var(--system-orange)';
      case 'in_progress': return 'var(--system-blue)';
      case 'on_hold': return 'var(--system-red)';
      case 'resolved': return 'var(--system-purple)';
      case 'closed': return 'var(--system-gray)';
      default: return 'var(--system-gray)';
    }
  };

  return (
    <Link 
      to={`/tickets/${ticket.id}`}
      className="block group apple-transition"
    >
      <div className="apple-card p-4 space-y-3">
        {/* Заголовок и статус */}
        <div className="flex items-start justify-between">
          <h3 className="apple-text-headline line-clamp-2 flex-1 mr-3" 
              style={{ color: 'var(--label-primary)' }}>
            {ticket.title}
          </h3>
          <div className="flex flex-col items-end space-y-2 flex-shrink-0">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>
        </div>

        {/* Описание */}
        {ticket.description && (
          <p className="apple-text-body line-clamp-2" 
             style={{ color: 'var(--label-secondary)' }}>
            {ticket.description}
          </p>
        )}

        {/* Мета-информация */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="apple-text-footnote" style={{ color: 'var(--label-secondary)' }}>
                {ticket.assignee ? ticket.assignee.firstName : 'Не назначен'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="apple-text-caption" style={{ color: 'var(--label-tertiary)' }}>
                #{ticket.id}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="apple-text-caption" style={{ color: 'var(--label-tertiary)' }}>
              {formatDate(ticket.createdAt)}
            </span>
            {ticket.category && (
              <span className="apple-text-caption" style={{ color: 'var(--label-tertiary)' }}>
                {ticket.category}
              </span>
            )}
          </div>
        </div>

        {/* Прогресс-индикатор */}
        <div className="pt-2 border-t" style={{ borderColor: 'var(--separator-non-opaque)' }}>
          <div className="flex items-center justify-between mb-1">
            <span className="apple-text-caption" style={{ color: 'var(--label-secondary)' }}>
              Прогресс
            </span>
            <span className="apple-text-caption" style={{ color: 'var(--label-secondary)' }}>
              {getProgressPercentage(ticket.status)}%
            </span>
          </div>
          <div className="w-full h-1 rounded-full overflow-hidden" 
               style={{ backgroundColor: 'var(--fill-quaternary)' }}>
            <div 
              className="h-full apple-transition"
              style={{ 
                backgroundColor: getStatusColor(ticket.status),
                width: `${getProgressPercentage(ticket.status)}%` 
              }}
            />
          </div>
        </div>

        {/* Индикатор критической срочности */}
        {ticket.priority === 'critical' && (
          <div className="flex items-center space-x-2 p-2 rounded" 
               style={{ 
                 backgroundColor: 'var(--fill-tertiary)',
                 color: 'var(--system-red)'
               }}>
            <span className="apple-text-footnote font-medium">
              ⚠️ Критическая срочность
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

// Функция для расчета прогресса по статусу
function getProgressPercentage(status: string): number {
  switch (status) {
    case 'new': return 10;
    case 'assigned': return 30;
    case 'in_progress': return 60;
    case 'on_hold': return 70;
    case 'resolved': return 90;
    case 'closed': return 100;
    default: return 0;
  }
}
