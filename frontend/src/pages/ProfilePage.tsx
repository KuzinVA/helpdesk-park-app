import React from 'react';
import { useAuthStore } from '@/stores/authStore';

export const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Профиль</h1>

      <div className="card">
        <div className="space-y-6">
          {/* Основная информация */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Основная информация</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Имя
                </label>
                <p className="text-gray-900">{user?.firstName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Фамилия
                </label>
                <p className="text-gray-900">{user?.lastName || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Роль
                </label>
                <p className="text-gray-900">{user?.role}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Служба
                </label>
                <p className="text-gray-900">{user?.service?.name || '-'}</p>
              </div>
            </div>
          </div>

          {/* Настройки уведомлений */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Настройки уведомлений</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Каналы уведомлений
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span>В приложении</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>В Telegram</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Тихие часы (начало)
                  </label>
                  <input type="time" className="input" defaultValue="22:00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Тихие часы (конец)
                  </label>
                  <input type="time" className="input" defaultValue="07:00" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Частота дайджеста
                </label>
                <select className="input">
                  <option value="off">Отключено</option>
                  <option value="daily">Ежедневно</option>
                  <option value="weekly">Еженедельно</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="btn-primary">
              Сохранить настройки
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
