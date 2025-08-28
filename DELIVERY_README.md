# 🎡 Helpdesk Park - Готовое приложение для заказчика

## 📋 **Описание проекта**

**Helpdesk Park** - это полноценная система управления заявками для парка аттракционов, интегрированная с Telegram Mini App. Приложение позволяет сотрудникам создавать, отслеживать и управлять заявками через удобный веб-интерфейс и Telegram бота.

## ✨ **Ключевые возможности**

### **🎯 Основной функционал**
- ✅ **Управление заявками** - создание, редактирование, назначение исполнителей
- ✅ **Система ролей** - сотрудники, исполнители, руководители служб, администраторы
- ✅ **Отслеживание статусов** - новая, назначена, в работе, на паузе, решена, закрыта
- ✅ **Приоритизация** - низкий, средний, высокий, критический
- ✅ **Уведомления** - Telegram и in-app уведомления
- ✅ **Статистика** - аналитика по заявкам и производительности

### **📱 Telegram Mini App**
- ✅ **Полная интеграция** с Telegram WebApp API
- ✅ **Автоматическая тема** - светлая/темная
- ✅ **Haptic Feedback** - тактильная обратная связь
- ✅ **Нативная навигация** - кнопки "Назад" и "Главная"
- ✅ **Responsive дизайн** - оптимизация для мобильных устройств

### **🎨 Дизайн**
- ✅ **Apple Design System** - системные цвета и типографика
- ✅ **Mobile-first** подход
- ✅ **Tailwind CSS** для стилизации
- ✅ **Современный UI/UX**

## 🏗️ **Архитектура**

### **Frontend**
- **React 18** + **TypeScript**
- **Vite** для сборки
- **Tailwind CSS** для стилизации
- **Zustand** для управления состоянием
- **React Router** для навигации

### **Backend**
- **NestJS** фреймворк
- **PostgreSQL** база данных
- **Prisma** ORM
- **JWT** аутентификация
- **Bull** для очередей уведомлений

### **Telegram Integration**
- **Telegram Bot API** для бота
- **Telegram WebApp API** для Mini App
- **Webhook** для получения обновлений

## 🚀 **Быстрый старт**

### **1. Предварительные требования**
- Node.js 18+ 
- PostgreSQL 12+
- Redis (для очередей)
- Telegram Bot Token

### **2. Установка зависимостей**
```bash
# Backend
npm install

# Frontend
cd frontend
npm install
```

### **3. Настройка базы данных**
```bash
# Создание миграций
npx prisma migrate dev

# Заполнение тестовыми данными
npx prisma db seed
```

### **4. Настройка переменных окружения**
Создайте файл `.env` на основе `.env.example`:
```env
# База данных
DATABASE_URL="postgresql://user:password@localhost:5432/helpdesk_park"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_BOT_USERNAME=your_bot_username

# JWT
JWT_SECRET=your_jwt_secret

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### **5. Запуск приложения**
```bash
# Backend (в одном терминале)
npm run start:dev

# Frontend (в другом терминале)
cd frontend
npm run dev
```

### **6. Настройка Telegram бота**
1. Создайте бота через @BotFather
2. Получите токен и username
3. Установите webhook: `GET /telegram/webhook/set/your_webhook_url`
4. Протестируйте: `GET /telegram/test/your_chat_id`

## 📱 **Использование Mini App**

### **Для пользователей:**
1. Найдите бота в Telegram
2. Отправьте `/start`
3. Нажмите "Открыть приложение"
4. Войдите в систему
5. Используйте все функции helpdesk

### **Для администраторов:**
1. Создавайте пользователей и назначайте роли
2. Настраивайте службы и локации
3. Управляйте заявками и приоритетами
4. Просматривайте статистику и отчеты

## 🔧 **API Endpoints**

### **Основные endpoints:**
- `POST /auth/telegram` - аутентификация через Telegram
- `GET /tickets` - список заявок
- `POST /tickets` - создание заявки
- `PUT /tickets/:id` - обновление заявки
- `GET /stats` - статистика
- `GET /telegram/webhook` - webhook для бота

### **Swagger документация:**
После запуска доступна по адресу: `http://localhost:3000/api`

## 📊 **Мониторинг и логи**

### **Health check:**
- `GET /health` - статус приложения

### **Логи:**
- Backend логи в консоли
- Frontend логи в браузере
- Telegram API логи в сервисе

## 🚀 **Развертывание в продакшене**

### **1. Сборка приложения**
```bash
# Backend
npm run build

# Frontend
cd frontend
npm run build
```

### **2. Docker (опционально)**
```bash
docker-compose up -d
```

### **3. Переменные окружения для продакшена**
```env
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
DATABASE_URL=your_production_db_url
REDIS_HOST=your_production_redis
```

## 📞 **Поддержка и контакты**

### **Документация:**
- [Основной README](README.md)
- [Настройка Telegram](BOTFATHER_SETUP.md)
- [Тестирование Mini App](MINI_APP_TEST.md)

### **Полезные команды:**
```bash
# Проверка статуса
npm run start:prod

# Тестирование
npm run test

# Линтинг
npm run lint

# Форматирование
npm run format
```

## 🎯 **Готово к использованию!**

Приложение полностью готово и протестировано. Все основные функции работают, Telegram Mini App интегрирован, дизайн оптимизирован для мобильных устройств.

**Удачи с вашим проектом! 🚀**
