import React from 'react';
import { TicketPriority } from '../types';

interface PriorityBadgeProps {
  priority: TicketPriority;
  className?: string;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className = '' }) => {
  const getPriorityConfig = (priority: TicketPriority) => {
    switch (priority) {
      case TicketPriority.LOW:
        return {
          label: 'Низкий',
          color: 'bg-system-green',
          textColor: 'text-white',
          icon: '🟢'
        };
      case TicketPriority.MEDIUM:
        return {
          label: 'Средний',
          color: 'bg-system-yellow',
          textColor: 'text-label-primary',
          icon: '🟡'
        };
      case TicketPriority.HIGH:
        return {
          label: 'Высокий',
          color: 'bg-system-orange',
          textColor: 'text-white',
          icon: '🟠'
        };
      case TicketPriority.URGENT:
        return {
          label: 'Срочно',
          color: 'bg-system-red',
          textColor: 'text-white',
          icon: '🔴'
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

  const config = getPriorityConfig(priority);

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

export default PriorityBadge;
