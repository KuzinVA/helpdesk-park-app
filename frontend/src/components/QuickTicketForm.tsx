import React, { useState, useEffect } from 'react';
import { MentionInput } from './MentionInput';
import { useTelegram } from '@/hooks/useTelegram';
import { useTicketStore } from '@/stores/ticketStore';

interface QuickTicketFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName?: string;
  displayName: string;
  role: string;
  service?: string;
}

export const QuickTicketForm: React.FC<QuickTicketFormProps> = ({
  onClose,
  onSuccess,
}) => {
  const { isTelegramApp, user } = useTelegram();
  const { createTicket } = useTicketStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [mentionedUsers, setMentionedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState<string | undefined>();

  // Получаем ID чата из Telegram WebApp
  useEffect(() => {
    if (isTelegramApp && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      // Попытка получить chat_id из initData
      if (tg.initDataUnsafe?.start_param) {
        setChatId(tg.initDataUnsafe.start_param);
      }
    }
  }, [isTelegramApp]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Пожалуйста, введите заголовок заявки');
      return;
    }

    setIsLoading(true);
    
    try {
      // Автоматическое назначение ответственного из упоминаний
      const assigneeId = mentionedUsers.length > 0 ? mentionedUsers[0].id : undefined;
      
      await createTicket({
        title: title.trim(),
        description: description.trim(),
        priority,
        status: 'new',
        assignedTo: assigneeId,
      });

      // Сброс формы
      setTitle('');
      setDescription('');
      setPriority('medium');
      setMentionedUsers([]);
      
      onSuccess?.();
      
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Ошибка при создании заявки');
    } finally {
      setIsLoading(false);
    }
  };

  const priorityOptions = [
    { value: 'low', label: 'Низкий', color: 'var(--system-green)' },
    { value: 'medium', label: 'Средний', color: 'var(--system-orange)' },
    { value: 'high', label: 'Высокий', color: 'var(--system-red)' },
    { value: 'critical', label: 'Критический', color: 'var(--system-red)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" 
         style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="apple-card w-full max-w-md max-h-[80vh] overflow-y-auto">
        {/* Заголовок */}
        <div className="p-4 border-b" style={{ borderColor: 'var(--separator-non-opaque)' }}>
          <div className="flex items-center justify-between">
            <h2 className="apple-text-large-title" style={{ color: 'var(--label-primary)' }}>
              Быстрая заявка
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center apple-transition"
              style={{ backgroundColor: 'var(--fill-quaternary)' }}
            >
              <span style={{ color: 'var(--label-primary)' }}>✕</span>
            </button>
          </div>
          <p className="apple-text-footnote mt-1" style={{ color: 'var(--label-secondary)' }}>
            Используйте @username для быстрого назначения ответственного
          </p>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Заголовок */}
          <div>
            <label className="apple-text-footnote block mb-2" 
                   style={{ color: 'var(--label-secondary)' }}>
              Заголовок *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Опишите проблему кратко..."
              className="apple-input w-full"
              maxLength={100}
              required
            />
            <div className="apple-text-caption mt-1" 
                 style={{ color: 'var(--label-tertiary)' }}>
              {title.length}/100
            </div>
          </div>

          {/* Приоритет */}
          <div>
            <label className="apple-text-footnote block mb-2" 
                   style={{ color: 'var(--label-secondary)' }}>
              Приоритет
            </label>
            <div className="grid grid-cols-2 gap-2">
              {priorityOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPriority(option.value as any)}
                  className={`p-2 rounded-lg apple-transition text-sm font-medium ${
                    priority === option.value 
                      ? 'apple-button-primary' 
                      : ''
                  }`}
                  style={priority === option.value ? {} : {
                    backgroundColor: 'var(--fill-quaternary)',
                    color: option.color,
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Описание с поддержкой @mentions */}
          <div>
            <label className="apple-text-footnote block mb-2" 
                   style={{ color: 'var(--label-secondary)' }}>
              Описание
            </label>
            <MentionInput
              value={description}
              onChange={(value, mentions) => {
                setDescription(value);
                setMentionedUsers(mentions);
              }}
              placeholder="Подробно опишите проблему... Используйте @username для назначения ответственного"
              chatId={chatId}
              className="min-h-[80px]"
            />
          </div>

          {/* Упомянутые пользователи */}
          {mentionedUsers.length > 0 && (
            <div>
              <label className="apple-text-footnote block mb-2" 
                     style={{ color: 'var(--label-secondary)' }}>
                Будут уведомлены ({mentionedUsers.length})
              </label>
              <div className="space-y-2">
                {mentionedUsers.map(user => (
                  <div key={user.id} 
                       className="flex items-center justify-between p-2 rounded"
                       style={{ backgroundColor: 'var(--fill-quaternary)' }}>
                    <div>
                      <div className="apple-text-body font-medium" 
                           style={{ color: 'var(--label-primary)' }}>
                        @{user.username}
                      </div>
                      <div className="apple-text-caption" 
                           style={{ color: 'var(--label-secondary)' }}>
                        {user.firstName} {user.lastName || ''}
                      </div>
                    </div>
                    <div className="text-xs px-2 py-1 rounded" 
                         style={{ 
                           backgroundColor: 'var(--system-blue)',
                           color: 'white'
                         }}>
                      {user.role}
                    </div>
                  </div>
                ))}
                {mentionedUsers.length > 0 && (
                  <div className="apple-text-caption p-2 rounded" 
                       style={{ 
                         backgroundColor: 'var(--fill-tertiary)',
                         color: 'var(--label-secondary)'
                       }}>
                    💡 Первый упомянутый пользователь будет назначен ответственным
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Кнопки */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="apple-button-secondary flex-1"
              disabled={isLoading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="apple-button-primary flex-1"
              disabled={isLoading || !title.trim()}
            >
              {isLoading ? 'Создание...' : 'Создать заявку'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
