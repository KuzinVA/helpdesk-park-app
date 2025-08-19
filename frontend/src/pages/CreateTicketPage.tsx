import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../hooks/useTelegram';
import { useNotifications } from '../components/NotificationProvider';

// 🎨 Mobile-first CreateTicketPage с Apple-style дизайном
const CreateTicketPage: React.FC = () => {
  const navigate = useNavigate();
  const { hapticFeedback } = useTelegram();
  const { addNotification } = useNotifications();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assignee: '',
    dueDate: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

    // Mock submission
    addNotification({
      type: 'success',
      message: 'Заявка успешно создана!',
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
          <p className="apple-text-caption-1 text-label-tertiary">Новая задача для команды</p>
        </div>
      </div>

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
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'low', label: 'Низкий', color: 'system-green', icon: '🟢' },
              { value: 'medium', label: 'Средний', color: 'system-orange', icon: '🟡' },
              { value: 'high', label: 'Высокий', color: 'system-red', icon: '🔴' },
            ].map((priority) => (
              <button
                key={priority.value}
                type="button"
                onClick={() => handleInputChange('priority', priority.value)}
                className={`p-3 rounded-12 border-2 transition-all ${
                  formData.priority === priority.value
                    ? `border-${priority.color} bg-${priority.color}/10`
                    : 'border-separator-opaque hover:border-system-blue/50'
                }`}
              >
                <div className="text-center space-y-1">
                  <div className="text-xl">{priority.icon}</div>
                  <div className="apple-text-caption-1 text-label-primary">
                    {priority.label}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Assignee */}
        <div className="space-y-2">
          <label className="apple-text-headline text-label-primary">
            Ответственный
          </label>
          <input
            type="text"
            value={formData.assignee}
            onChange={(e) => handleInputChange('assignee', e.target.value)}
            placeholder="@username или имя сотрудника"
            className="search-bar w-full"
          />
          <p className="apple-text-caption-2 text-label-tertiary">
            Используйте @ для упоминания пользователей из чата
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
          />
        </div>

        {/* Quick Templates */}
        <div className="space-y-3">
          <h3 className="apple-text-headline text-label-primary">Быстрые шаблоны</h3>
          <div className="mobile-grid">
            {[
              { title: 'Баги', icon: '🐛', color: 'system-red' },
              { title: 'Улучшения', icon: '✨', color: 'system-blue' },
              { title: 'Запросы', icon: '📝', color: 'system-green' },
              { title: 'Поддержка', icon: '🆘', color: 'system-orange' },
            ].map((template) => (
              <button
                key={template.title}
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    title: `${template.title}: `,
                    priority: template.title === 'Баги' ? 'high' : 'medium'
                  }));
                }}
                className="apple-card p-4 text-left hover:scale-105 apple-transition"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-${template.color}/10 rounded-full flex items-center justify-center`}>
                    <span className={`text-${template.color} text-xl`}>{template.icon}</span>
                  </div>
                  <div>
                    <h4 className="apple-text-headline text-label-primary">{template.title}</h4>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full apple-button-primary py-4 text-lg font-medium hover:scale-105 apple-transition"
        >
          <div className="flex items-center justify-center space-x-3">
            <span className="text-xl">🚀</span>
            <span>Создать заявку</span>
          </div>
        </button>
      </form>
    </div>
  );
};

export default CreateTicketPage;
