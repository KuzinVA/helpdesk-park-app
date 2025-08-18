import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'new':
        return {
          label: 'Новая',
          bgColor: 'var(--system-green)',
          textColor: 'white'
        };
      case 'assigned':
        return {
          label: 'Назначена',
          bgColor: 'var(--system-orange)',
          textColor: 'white'
        };
      case 'in_progress':
        return {
          label: 'В работе',
          bgColor: 'var(--system-blue)',
          textColor: 'white'
        };
      case 'on_hold':
        return {
          label: 'На паузе',
          bgColor: 'var(--system-red)',
          textColor: 'white'
        };
      case 'resolved':
        return {
          label: 'Решена',
          bgColor: 'var(--system-purple)',
          textColor: 'white'
        };
      case 'closed':
        return {
          label: 'Закрыта',
          bgColor: 'var(--system-gray)',
          textColor: 'white'
        };
      default:
        return {
          label: 'Неизвестно',
          bgColor: 'var(--fill-tertiary)',
          textColor: 'var(--label-secondary)'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div 
      className="inline-flex items-center px-2.5 py-1 rounded-md apple-transition"
      style={{ 
        backgroundColor: config.bgColor,
        color: config.textColor
      }}
    >
      <span className="text-xs font-semibold">
        {config.label}
      </span>
    </div>
  );
};
