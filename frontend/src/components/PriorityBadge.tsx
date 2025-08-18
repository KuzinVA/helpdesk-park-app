import React from 'react';

interface PriorityBadgeProps {
  priority: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'low':
        return {
          label: 'Низкая',
          bgColor: 'var(--fill-tertiary)',
          textColor: 'var(--system-green)'
        };
      case 'medium':
        return {
          label: 'Средняя',
          bgColor: 'var(--fill-tertiary)',
          textColor: 'var(--system-orange)'
        };
      case 'high':
        return {
          label: 'Высокая',
          bgColor: 'var(--fill-tertiary)',
          textColor: 'var(--system-red)'
        };
      case 'critical':
        return {
          label: 'Критическая',
          bgColor: 'var(--system-red)',
          textColor: 'white'
        };
      default:
        return {
          label: 'Не указана',
          bgColor: 'var(--fill-quaternary)',
          textColor: 'var(--label-secondary)'
        };
    }
  };

  const config = getPriorityConfig(priority);

  return (
    <div 
      className="inline-flex items-center px-2 py-0.5 rounded apple-transition text-xs font-medium"
      style={{ 
        backgroundColor: config.bgColor,
        color: config.textColor
      }}
    >
      {config.label}
    </div>
  );
};
