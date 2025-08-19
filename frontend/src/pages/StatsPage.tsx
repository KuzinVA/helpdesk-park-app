import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../hooks/useTelegram';

// 🎨 Mobile-first StatsPage с Apple-style дизайном
const StatsPage: React.FC = () => {
  const navigate = useNavigate();
  const { hapticFeedback } = useTelegram();
  const [timeRange, setTimeRange] = useState('week');

  const handleBack = () => {
    if (hapticFeedback) {
      hapticFeedback.impactOccurred('light');
    }
    navigate(-1);
  };

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    if (hapticFeedback) {
      hapticFeedback.impactOccurred('light');
    }
  };

  // Mock statistics data
  const stats = {
    total: 156,
    new: 23,
    inProgress: 45,
    resolved: 88,
    avgResolutionTime: '2.3 дня',
    satisfaction: '4.8/5',
  };

  const trends = [
    { label: 'Пн', value: 12, color: 'system-blue' },
    { label: 'Вт', value: 18, color: 'system-blue' },
    { label: 'Ср', value: 15, color: 'system-blue' },
    { label: 'Чт', value: 22, color: 'system-blue' },
    { label: 'Пт', value: 19, color: 'system-blue' },
    { label: 'Сб', value: 8, color: 'system-blue' },
    { label: 'Вс', value: 5, color: 'system-blue' },
  ];

  const topCategories = [
    { name: 'Технические проблемы', count: 45, percentage: 29 },
    { name: 'Запросы функций', count: 32, percentage: 21 },
    { name: 'Поддержка пользователей', count: 28, percentage: 18 },
    { name: 'Баги', count: 25, percentage: 16 },
    { name: 'Документация', count: 16, percentage: 10 },
  ];

  const teamPerformance = [
    { name: 'Иван Петров', tickets: 23, resolved: 21, rating: 4.9 },
    { name: 'Мария Сидорова', tickets: 19, resolved: 18, rating: 4.8 },
    { name: 'Алексей Козлов', tickets: 17, resolved: 15, rating: 4.7 },
    { name: 'Анна Иванова', tickets: 15, resolved: 14, rating: 4.6 },
  ];

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
          <h1 className="apple-text-title-1 text-label-primary">Статистика</h1>
          <p className="apple-text-caption-1 text-label-tertiary">Анализ эффективности работы</p>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="space-y-3">
        <h3 className="apple-text-headline text-label-primary">Период</h3>
        <div className="flex space-x-2">
          {[
            { value: 'week', label: 'Неделя' },
            { value: 'month', label: 'Месяц' },
            { value: 'quarter', label: 'Квартал' },
            { value: 'year', label: 'Год' },
          ].map((range) => (
            <button
              key={range.value}
              onClick={() => handleTimeRangeChange(range.value)}
              className={`px-4 py-2 rounded-12 apple-transition ${
                timeRange === range.value
                  ? 'bg-system-blue text-white'
                  : 'bg-system-fill-secondary text-label-primary hover:bg-system-fill-tertiary'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="mobile-grid">
        <div className="apple-card p-4">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-system-blue/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-system-blue text-xl">📊</span>
            </div>
            <p className="apple-text-title-2 font-bold text-label-primary">{stats.total}</p>
            <p className="apple-text-caption-1 text-label-tertiary">Всего заявок</p>
          </div>
        </div>

        <div className="apple-card p-4">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-system-green/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-system-green text-xl">✅</span>
            </div>
            <p className="apple-text-title-2 font-bold text-label-primary">{stats.resolved}</p>
            <p className="apple-text-caption-1 text-label-tertiary">Решено</p>
          </div>
        </div>

        <div className="apple-card p-4">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-system-orange/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-system-orange text-xl">⚡</span>
            </div>
            <p className="apple-text-title-2 font-bold text-label-primary">{stats.avgResolutionTime}</p>
            <p className="apple-text-caption-1 text-label-tertiary">Среднее время</p>
          </div>
        </div>

        <div className="apple-card p-4">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-system-purple/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-system-purple text-xl">⭐</span>
            </div>
            <p className="apple-text-title-2 font-bold text-label-primary">{stats.satisfaction}</p>
            <p className="apple-text-caption-1 text-label-tertiary">Удовлетворенность</p>
          </div>
        </div>
      </div>

      {/* Weekly Trend */}
      <div className="apple-card p-4 space-y-4">
        <h3 className="apple-text-headline text-label-primary">Тренд за неделю</h3>
        
        <div className="flex items-end justify-between space-x-2 h-32">
          {trends.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center space-y-2">
              <div 
                className="w-full bg-system-blue/20 rounded-t-4 transition-all hover:bg-system-blue/30"
                style={{ height: `${(day.value / 25) * 100}%` }}
              ></div>
              <span className="apple-text-caption-2 text-label-tertiary">{day.label}</span>
              <span className="apple-text-caption-1 text-label-primary">{day.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Categories */}
      <div className="space-y-3">
        <h3 className="apple-text-headline text-label-primary">Топ категорий</h3>
        
        <div className="space-y-2">
          {topCategories.map((category, index) => (
            <div key={index} className="apple-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="apple-text-headline text-label-primary">{category.name}</h4>
                    <span className="apple-text-caption-1 text-label-secondary">{category.count}</span>
                  </div>
                  <div className="w-full bg-system-fill-secondary rounded-full h-2">
                    <div 
                      className="bg-system-blue h-2 rounded-full transition-all"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                  <p className="apple-text-caption-2 text-label-tertiary mt-1">
                    {category.percentage}% от общего числа
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Performance */}
      <div className="space-y-3">
        <h3 className="apple-text-headline text-label-primary">Эффективность команды</h3>
        
        <div className="space-y-2">
          {teamPerformance.map((member, index) => (
            <div key={index} className="apple-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-system-fill-secondary rounded-full flex items-center justify-center">
                    <span className="text-label-primary text-sm">👤</span>
                  </div>
                  <div>
                    <h4 className="apple-text-headline text-label-primary">{member.name}</h4>
                    <p className="apple-text-caption-1 text-label-tertiary">
                      {member.resolved}/{member.tickets} заявок
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <span className="text-system-yellow">⭐</span>
                    <span className="apple-text-headline text-label-primary">{member.rating}</span>
                  </div>
                  <p className="apple-text-caption-2 text-label-tertiary">
                    {Math.round((member.resolved / member.tickets) * 100)}% успешность
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Insights */}
      <div className="apple-card p-4 space-y-3">
        <h3 className="apple-text-headline text-label-primary">Инсайты</h3>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-system-green/10 rounded-full flex items-center justify-center">
              <span className="text-system-green text-sm">📈</span>
            </div>
            <div>
              <p className="apple-text-body text-label-primary">
                Эффективность команды выросла на 15% по сравнению с прошлым месяцем
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-system-blue/10 rounded-full flex items-center justify-center">
              <span className="text-system-blue text-sm">⚡</span>
            </div>
            <div>
              <p className="apple-text-body text-label-primary">
                Среднее время решения заявок сократилось с 3.2 до 2.3 дней
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-system-orange/10 rounded-full flex items-center justify-center">
              <span className="text-system-orange text-sm">🎯</span>
            </div>
            <div>
              <p className="apple-text-body text-label-primary">
                Наиболее активный день недели - четверг (22 заявки)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
