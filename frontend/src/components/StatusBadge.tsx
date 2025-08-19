import React from 'react';
import { TicketStatus } from '../types';

interface StatusBadgeProps {
  status: TicketStatus;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusConfig = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.NEW:
        return {
          label: 'Новая',
          color: 'bg-system-blue',
          textColor: 'text-white',
          icon: '🆕'
        };
      case TicketStatus.IN_PROGRESS:
        return {
          label: 'В работе',
          color: 'bg-system-orange',
          textColor: 'text-white',
          icon: '⚡'
        };
      case TicketStatus.WAITING_FOR_CUSTOMER:
        return {
          label: 'Ожидает клиента',
          color: 'bg-system-yellow',
          textColor: 'text-label-primary',
          icon: '⏳'
        };
      case TicketStatus.RESOLVED:
        return {
          label: 'Решена',
          color: 'bg-system-green',
          textColor: 'text-white',
          icon: '✅'
        };
      case TicketStatus.CLOSED:
        return {
          label: 'Закрыта',
          color: 'bg-fill-secondary',
          textColor: 'text-label-secondary',
          icon: '🔒'
        };
      default:
        return {
          label: 'Неизвестно',
          color: 'bg-fill-quaternary',
          textColor: 'text-label-tertiary',
          icon: '❓'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`
        inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium
        ${config.color} ${config.textColor} ${className}
        apple-transition
      `}
    >
      <span className="text-sm">{config.icon}</span>
      <span className="apple-text-caption-1">{config.label}</span>
    </span>
  );
};

export default StatusBadge;
