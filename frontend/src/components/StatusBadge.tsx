import React from 'react';
import { TicketStatus } from '@/types';

interface StatusBadgeProps {
  status: TicketStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: TicketStatus) => {
    switch (status) {
      case 'NEW':
        return { label: 'Новая', className: 'badge-status-new' };
      case 'ASSIGNED':
        return { label: 'Назначена', className: 'badge-status-assigned' };
      case 'IN_PROGRESS':
        return { label: 'В работе', className: 'badge-status-in-progress' };
      case 'ON_HOLD':
        return { label: 'Приостановлена', className: 'badge-status-on-hold' };
      case 'RESOLVED':
        return { label: 'Решена', className: 'badge-status-resolved' };
      case 'CLOSED':
        return { label: 'Закрыта', className: 'badge-status-closed' };
      default:
        return { label: status, className: 'badge bg-gray-100 text-gray-800' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={config.className}>
      {config.label}
    </span>
  );
};
