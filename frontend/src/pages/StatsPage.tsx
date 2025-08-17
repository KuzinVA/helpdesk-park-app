import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const StatsPage: React.FC = () => {
  // TODO: Загружать данные с backend
  const statusData = [
    { name: 'Новые', value: 5, color: '#3B82F6' },
    { name: 'Назначенные', value: 3, color: '#F59E0B' },
    { name: 'В работе', value: 8, color: '#8B5CF6' },
    { name: 'Решенные', value: 12, color: '#10B981' },
    { name: 'Закрытые', value: 20, color: '#6B7280' },
  ];

  const priorityData = [
    { name: 'Низкий', value: 8, color: '#6B7280' },
    { name: 'Средний', value: 15, color: '#3B82F6' },
    { name: 'Высокий', value: 12, color: '#F59E0B' },
    { name: 'Критический', value: 3, color: '#EF4444' },
  ];

  const serviceData = [
    { name: 'Техническая', value: 25, color: '#3B82F6' },
    { name: 'Безопасность', value: 8, color: '#10B981' },
    { name: 'Уборка', value: 5, color: '#F59E0B' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Статистика</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Общие метрики */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Общие показатели</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Всего заявок:</span>
              <span className="font-semibold">38</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Активных:</span>
              <span className="font-semibold">16</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Среднее время решения:</span>
              <span className="font-semibold">2ч 15м</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">SLA соблюдается:</span>
              <span className="font-semibold text-success-600">85%</span>
            </div>
          </div>
        </div>

        {/* График по статусам */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">По статусам</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* График по приоритетам */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">По приоритетам</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* График по службам */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">По службам</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={serviceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
