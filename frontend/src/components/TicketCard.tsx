import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, User, MapPin } from 'lucide-react';
import { Ticket } from '@/types';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';

interface TicketCardProps {
  ticket: Ticket;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Link
      to={`/tickets/${ticket.id}`}
      className="block card hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
          {ticket.title}
        </h3>
        <div className="flex space-x-2">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">
        {ticket.description}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{ticket.location?.name || 'Локация не указана'}</span>
          </div>
          
          {ticket.assignedTo && (
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>{ticket.assignedTo.firstName}</span>
            </div>
          )}
        </div>

        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span>{formatDate(ticket.createdAt)}</span>
        </div>
      </div>

      {/* Теги */}
      {ticket.tags && ticket.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {ticket.tags.map((tag) => (
            <span
              key={tag.id}
              className="px-2 py-1 text-xs rounded-full"
              style={{ backgroundColor: tag.tag.color + '20', color: tag.tag.color }}
            >
              {tag.tag.name}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
};
