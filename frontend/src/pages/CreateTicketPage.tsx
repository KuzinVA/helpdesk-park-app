import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../hooks/useTelegram';
import { useChatId } from '../hooks/useChatId';
import { useNotifications } from '../components/NotificationProvider';
import { MemberSelector } from '../components/MemberSelector';
import { TelegramUser } from '../services/telegramApi';

// 🎨 Mobile-first CreateTicketPage с Apple-style дизайном и выбором участников
const CreateTicketPage: React.FC = () => {
  const navigate = useNavigate();
  const { hapticFeedback, webApp } = useTelegram();
  const { chatId, hasChatId, chatTitle, isGroupChat } = useChatId();
  const { addNotification } = useNotifications();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    assignees: [] as TelegramUser[],
    dueDate: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAssigneesChange = (assignees: TelegramUser[]) => {
    setFormData(prev => ({ ...prev, assignees }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (hapticFeedback) {
      hapticFeedback.impactOccurred('medium');
    }

    // Validate form
    if (!formData.title.trim()) {
      addNotification({
        type: 'error',
        message: 'Пожалуйста, укажите название заявки',
      });
      return;
    }

    // Создаем объект заявки с реальными данными
    const ticket = {
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'new' as const,
      createdBy: webApp?.initDataUnsafe?.user || null,
      chatId: chatId,
      chatTitle: chatTitle,
      assignees: formData.assignees.map(user => ({
        id: user.id,
        name: `${user.first_name} ${user.last_name || ''}`.trim(),
        username: user.username,
        isAdmin: false, // Можно добавить проверку через API
      })),
    };

    console.log('🎫 Создана заявка:', ticket);

    // Mock submission
    addNotification({
      type: 'success',
      message: `Заявка "${formData.title}" успешно создана!`,
    });

    // Navigate back to tickets
    setTimeout(() => {
      navigate('/tickets');
    }, 1500);
  };

  const handleBack = () => {
    if (hapticFeedback) {
      hapticFeedback.impactOccurred('light');
    }
    navigate(-1);
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
        <div>
          <h1 className="apple-text-title-1 text-label-primary">Создать заявку</h1>
          <p className="apple-text-caption-1 text-label-tertiary">
            {hasChatId ? `Новая задача в чате "${chatTitle}"` : 'Новая задача для команды'}
          </p>
        </div>
      </div>

      {/* Chat Info Banner */}
      {hasChatId && (
        <div className="p-4 bg-system-blue/10 border border-system-blue/20 rounded-12">
          <div className="flex items-center space-x-3">
            <span className="text-system-blue text-xl">
              {isGroupChat ? '👥' : '💬'}
            </span>
            <div>
              <h3 className="apple-text-headline text-system-blue font-semibold">
                {chatTitle}
              </h3>
              <p className="apple-text-caption-1 text-system-blue/80">
                {isGroupChat ? 'Групповой чат' : 'Личный чат'} • ID: {chatId}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <label className="apple-text-headline text-label-primary">
            Название заявки *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Краткое описание проблемы или задачи"
            className="search-bar w-full"
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="apple-text-headline text-label-primary">
            Описание
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Подробное описание проблемы, контекст, ожидаемый результат"
            rows={4}
            className="search-bar w-full resize-none"
          />
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <label className="apple-text-headline text-label-primary">
            Приоритет
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'low', label: 'Низкий', color: 'bg-system-green', emoji: '🟢' },
              { value: 'medium', label: 'Средний', color: 'bg-system-orange', emoji: '🟡' },
              { value: 'high', label: 'Высокий', color: 'bg-system-red', emoji: '🔴' },
              { value: 'critical', label: 'Критический', color: 'bg-system-purple', emoji: '🟣' },
            ].map((priority) => (
              <button
                key={priority.value}
                type="button"
                onClick={() => handleInputChange('priority', priority.value)}
                className={`p-3 rounded-12 border-2 transition-all ${
                  formData.priority === priority.value
                    ? `${priority.color} border-transparent text-white`
                    : 'border-separator-opaque bg-system-secondary-background text-label-primary hover:border-system-blue'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>{priority.emoji}</span>
                  <span className="apple-text-body font-medium">{priority.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Assignees - Выбор участников чата */}
        <div className="space-y-2">
          <label className="apple-text-headline text-label-primary">
            Назначить на
          </label>
          {hasChatId ? (
            <MemberSelector
              chatId={chatId!}
              selectedMembers={formData.assignees}
              onMembersChange={handleAssigneesChange}
              placeholder="Выберите участников для назначения..."
              multiple={true}
              maxMembers={3}
            />
          ) : (
            <div className="p-4 bg-system-fill-secondary rounded-12 text-center">
              <span className="text-label-tertiary">
                ⚠️ Chat ID не найден. Участники чата недоступны.
              </span>
              <p className="text-label-tertiary mt-2 text-sm">
                Убедитесь, что бот добавлен в чат как администратор
              </p>
            </div>
          )}
          <p className="apple-text-caption-1 text-label-tertiary">
            Выберите участников чата, которые будут работать над заявкой
          </p>
        </div>

        {/* Due Date */}
        <div className="space-y-2">
          <label className="apple-text-headline text-label-primary">
            Срок выполнения
          </label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleInputChange('dueDate', e.target.value)}
            className="search-bar w-full"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full apple-button-primary py-4 text-lg font-semibold"
          disabled={!hasChatId}
        >
          🎫 Создать заявку
        </button>
      </form>

      {/* Debug Info (только в разработке) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="p-4 bg-system-fill-secondary rounded-12">
          <h3 className="apple-text-headline mb-2">Debug Info:</h3>
          <p className="apple-text-caption-1">Chat ID: {chatId || 'Не найден'}</p>
          <p className="apple-text-caption-1">Chat Title: {chatTitle || 'Не найден'}</p>
          <p className="apple-text-caption-1">Is Group: {isGroupChat ? 'Да' : 'Нет'}</p>
          <p className="apple-text-caption-1">User: {webApp?.initDataUnsafe?.user?.first_name || 'Не найден'}</p>
          <p className="apple-text-caption-1">Selected Assignees: {formData.assignees.length}</p>
        </div>
      )}
    </div>
  );
};

export default CreateTicketPage;
