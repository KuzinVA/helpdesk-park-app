import React from 'react';
import { TicketPriority } from '@/types';

interface PriorityBadgeProps {
  priority: TicketPriority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const getPriorityConfig = (priority: TicketPriority) => {
    switch (priority) {
      case 'LOW':
        return { label: 'Низкий', className: 'badge-priority-low' };
      case 'MEDIUM':
        return { label: 'Средний', className: 'badge-priority-medium' };
      case 'HIGH':
        return { label: 'Высокий', className: 'badge-priority-high' };
      case 'CRITICAL':
        return { label: 'Критический', className: 'badge-priority-critical' };
      default:
        return { label: priority, className: 'badge bg-gray-100 text-gray-800' };
    }
  };

  const config = getPriorityConfig(priority);

  return (
    <span className={config.className}>
      {config.label}
    </span>
  );
};
