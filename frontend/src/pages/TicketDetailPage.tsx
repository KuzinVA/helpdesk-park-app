import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTelegram } from '../hooks/useTelegram';
import { useNotifications } from '../components/NotificationProvider';

// 🎨 Mobile-first TicketDetailPage с Apple-style дизайном
const TicketDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hapticFeedback } = useTelegram();
  const { addNotification } = useNotifications();
  
  const [isEditing, setIsEditing] = useState(false);

  // Mock ticket data
  const ticket = {
    id: id || '1',
    title: 'Проблема с доступом к системе',
    description: 'Пользователи не могут войти в систему из-за ошибки аутентификации. Проблема возникает при попытке входа с новыми учетными данными.',
    status: 'new',
    priority: 'high',
    assignee: 'Иван Петров',
    createdBy: 'Мария Сидорова',
    createdAt: '2 часа назад',
    dueDate: '2024-01-15',
    comments: [
      {
        id: '1',
        author: 'Иван Петров',
        text: 'Начинаю работу над проблемой. Сначала проверю логи сервера.',
        timestamp: '1 час назад',
        avatar: '👨‍💻'
      },
      {
        id: '2',
        author: 'Мария Сидорова',
        text: 'Спасибо! Это критично для работы команды.',
        timestamp: '30 минут назад',
        avatar: '👩‍💼'
      }
    ]
  };

  const handleBack = () => {
    if (hapticFeedback) {
      hapticFeedback.impactOccurred('light');
    }
    navigate(-1);
  };

  const handleStatusChange = (newStatus: string) => {
    if (hapticFeedback) {
      hapticFeedback.impactOccurred('medium');
    }
    
    addNotification({
      type: 'success',
      message: `Статус изменен на: ${newStatus}`,
    });
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
    if (hapticFeedback) {
      hapticFeedback.impactOccurred('light');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'system-blue';
      case 'in-progress': return 'system-orange';
      case 'resolved': return 'system-green';
      case 'closed': return 'label-tertiary';
      default: return 'label-tertiary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'system-green';
      case 'medium': return 'system-orange';
      case 'high': return 'system-red';
      case 'critical': return 'system-red';
      default: return 'label-tertiary';
    }
  };

  return (
    <div className="container mobile-padding space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handleBack}
          className="w-10 h-10 bg-system-fill-secondary rounded-full flex items-center justify-center hover:bg-system-fill-tertiary apple-transition"
        >
          <span className="text-label-primary">←</span>
        </button>
        <div className="flex-1">
          <h1 className="apple-text-title-1 text-label-primary line-clamp-2">
            {ticket.title}
          </h1>
          <p className="apple-text-caption-1 text-label-tertiary">
            #{ticket.id} • {ticket.createdAt}
          </p>
        </div>
        <button
          onClick={handleEdit}
          className="w-10 h-10 bg-system-fill-secondary rounded-full flex items-center justify-center hover:bg-system-fill-tertiary apple-transition"
        >
          <span className="text-label-primary">✏️</span>
        </button>
      </div>

      {/* Status and Priority */}
      <div className="mobile-grid">
        <div className="apple-card p-4">
          <div className="text-center space-y-2">
            <div className={`w-12 h-12 bg-${getStatusColor(ticket.status)}/10 rounded-full flex items-center justify-center mx-auto`}>
              <span className={`text-${getStatusColor(ticket.status)} text-2xl`}>
                {ticket.status === 'new' && '🆕'}
                {ticket.status === 'in-progress' && '⚡'}
                {ticket.status === 'resolved' && '✅'}
                {ticket.status === 'closed' && '🔒'}
              </span>
            </div>
            <div>
              <p className="apple-text-caption-1 text-label-tertiary">Статус</p>
              <p className="apple-text-headline text-label-primary">
                {ticket.status === 'new' && 'Новый'}
                {ticket.status === 'in-progress' && 'В работе'}
                {ticket.status === 'resolved' && 'Решено'}
                {ticket.status === 'closed' && 'Закрыто'}
              </p>
            </div>
          </div>
        </div>

        <div className="apple-card p-4">
          <div className="text-center space-y-2">
            <div className={`w-12 h-12 bg-${getPriorityColor(ticket.priority)}/10 rounded-full flex items-center justify-center mx-auto`}>
              <span className={`text-${getPriorityColor(ticket.priority)} text-2xl`}>
                {ticket.priority === 'low' && '🟢'}
                {ticket.priority === 'medium' && '🟡'}
                {ticket.priority === 'high' && '🔴'}
                {ticket.priority === 'critical' && '🚨'}
              </span>
            </div>
            <div>
              <p className="apple-text-caption-1 text-label-tertiary">Приоритет</p>
              <p className="apple-text-headline text-label-primary">
                {ticket.priority === 'low' && 'Низкий'}
                {ticket.priority === 'medium' && 'Средний'}
                {ticket.priority === 'high' && 'Высокий'}
                {ticket.priority === 'critical' && 'Критический'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="apple-card p-4 space-y-3">
        <h3 className="apple-text-headline text-label-primary">Описание</h3>
        <p className="apple-text-body text-label-secondary leading-relaxed">
          {ticket.description}
        </p>
      </div>

      {/* Details */}
      <div className="apple-card p-4 space-y-4">
        <h3 className="apple-text-headline text-label-primary">Детали</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="apple-text-caption-1 text-label-tertiary">Создал</span>
            <span className="apple-text-body text-label-primary">{ticket.createdBy}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="apple-text-caption-1 text-label-tertiary">Ответственный</span>
            <span className="apple-text-body text-label-primary">{ticket.assignee}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="apple-text-caption-1 text-label-tertiary">Срок</span>
            <span className="apple-text-body text-label-primary">{ticket.dueDate}</span>
          </div>
        </div>
      </div>

      {/* Status Actions */}
      <div className="space-y-3">
        <h3 className="apple-text-headline text-label-primary">Изменить статус</h3>
        <div className="mobile-grid">
          {[
            { status: 'new', label: 'Новый', icon: '🆕' },
            { status: 'in-progress', label: 'В работе', icon: '⚡' },
            { status: 'resolved', label: 'Решено', icon: '✅' },
            { status: 'closed', label: 'Закрыто', icon: '🔒' },
          ].map((statusOption) => (
            <button
              key={statusOption.status}
              onClick={() => handleStatusChange(statusOption.status)}
              className={`apple-card p-4 text-center hover:scale-105 apple-transition ${
                ticket.status === statusOption.status ? 'ring-2 ring-system-blue' : ''
              }`}
            >
              <div className="space-y-2">
                <div className="text-2xl">{statusOption.icon}</div>
                <div className="apple-text-caption-1 text-label-primary">
                  {statusOption.label}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Comments */}
      <div className="space-y-3">
        <h3 className="apple-text-headline text-label-primary">Комментарии</h3>
        
        <div className="space-y-3">
          {ticket.comments.map((comment) => (
            <div key={comment.id} className="apple-card p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-system-fill-secondary rounded-full flex items-center justify-center">
                  <span className="text-label-primary text-sm">{comment.avatar}</span>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="apple-text-caption-1 font-medium text-label-primary">
                      {comment.author}
                    </span>
                    <span className="apple-text-caption-2 text-label-tertiary">
                      {comment.timestamp}
                    </span>
                  </div>
                  <p className="apple-text-body text-label-secondary">
                    {comment.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Comment */}
        <div className="apple-card p-4">
          <div className="space-y-3">
            <textarea
              placeholder="Добавить комментарий..."
              rows={3}
              className="search-bar w-full resize-none"
            />
            <button className="apple-button-primary px-6 py-2 text-sm">
              Отправить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPage;
