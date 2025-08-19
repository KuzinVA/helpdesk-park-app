import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket, TicketStatus } from '../types';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

interface TicketCardProps {
  ticket: Ticket;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.NEW:
        return '#007AFF';
      case TicketStatus.IN_PROGRESS:
        return '#FF9500';
      case TicketStatus.WAITING_FOR_CUSTOMER:
        return '#FFCC00';
      case TicketStatus.RESOLVED:
        return '#34C759';
      case TicketStatus.CLOSED:
        return '#8E8E93';
      default:
        return '#C7C7CC';
    }
  };

  const getProgressPercentage = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.NEW:
        return 20;
      case TicketStatus.IN_PROGRESS:
        return 50;
      case TicketStatus.WAITING_FOR_CUSTOMER:
        return 70;
      case TicketStatus.RESOLVED:
        return 90;
      case TicketStatus.CLOSED:
        return 100;
      default:
        return 0;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <Link to={`/tickets/${ticket.id}`} className="block group apple-transition">
      <div className="apple-card p-4 space-y-3 hover:shadow-apple-lg apple-transition">
        {/* Header */}
        <div className="flex items-start justify-between">
          <h3 className="apple-text-headline line-clamp-2 flex-1 mr-3" style={{ color: 'var(--label-primary)' }}>
            {ticket.title}
          </h3>
          <div className="flex flex-col items-end space-y-2">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>
        </div>

        {/* Description */}
        <p className="apple-text-body line-clamp-2" style={{ color: 'var(--label-secondary)' }}>
          {ticket.description}
        </p>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span className="text-label-tertiary">
              📅 {formatDate(ticket.createdAt)}
            </span>
            {ticket.assignedTo && (
              <span className="text-label-tertiary">
                👤 {ticket.assignedTo.firstName} {ticket.assignedTo.lastName}
              </span>
            )}
          </div>
          <span className="text-label-tertiary">
            #{ticket.id.slice(-6)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="pt-2 border-t" style={{ borderColor: 'var(--separator-non-opaque)' }}>
          <div className="w-full h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--fill-quaternary)' }}>
            <div 
              className="h-full apple-transition" 
              style={{ 
                backgroundColor: getStatusColor(ticket.status), 
                width: `${getProgressPercentage(ticket.status)}%` 
              }} 
            />
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="apple-text-caption-1 text-label-tertiary">
              Прогресс: {getProgressPercentage(ticket.status)}%
            </span>
            <span className="apple-text-caption-1 text-label-tertiary">
              {ticket.status === TicketStatus.CLOSED ? 'Завершено' : 'В работе'}
            </span>
          </div>
        </div>

        {/* Hover Effect */}
        <div className="absolute inset-0 bg-system-blue opacity-0 group-hover:opacity-5 rounded-lg apple-transition pointer-events-none" />
      </div>
    </Link>
  );
};

export default TicketCard;
