# 📚 Helpdesk Park - Полное руководство по передаче проекта

## 🎯 Что это за проект?

**Helpdesk Park** - это полноценная система управления заявками с интеграцией Telegram Mini App. Позволяет создавать, отслеживать и управлять заявками через удобный интерфейс прямо в Telegram.

### ✨ Основные возможности:
- 📱 **Telegram Mini App** - работает как нативное приложение
- 🎨 **Apple Design System** - современный интерфейс
- 📋 **Управление заявками** - создание, назначение, отслеживание
- 👥 **Командная работа** - назначение исполнителей
- 📊 **Статистика** - аналитика и отчеты
- 🔔 **Уведомления** - автоматические уведомления в Telegram

## 🏗️ Архитектура проекта

```
helpdesk-park-app/
├── frontend/              # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/    # Переиспользуемые компоненты
│   │   ├── pages/         # Страницы приложения
│   │   ├── hooks/         # Кастомные хуки
│   │   ├── services/      # API сервисы
│   │   └── stores/        # Zustand store
│   ├── dist/              # Собранные файлы (автоматически)
│   └── package.json
├── src/                   # NestJS Backend
│   ├── auth/              # Аутентификация
│   ├── tickets/           # Логика заявок
│   ├── users/             # Управление пользователями
│   ├── telegram/          # Telegram интеграция
│   └── main.ts            # Точка входа
├── prisma/                # База данных
│   ├── schema.prisma      # Схема БД
│   └── seed.ts            # Начальные данные
├── .github/workflows/     # GitHub Actions
└── python-mcp/            # MCP интеграция
```

## 🚀 Быстрый старт для нового пользователя

### 1. **Получение проекта**

```bash
# Клонирование репозитория
git clone https://github.com/KuzinVA/helpdesk-park-app.git
cd helpdesk-park-app
```

### 2. **Настройка Frontend**

```bash
cd frontend
npm install
npm run build
```

### 3. **Создание собственного Telegram бота**

1. **Найдите @BotFather** в Telegram
2. **Отправьте команду:** `/newbot`
3. **Введите название бота:** `Your Helpdesk Bot`
4. **Введите username:** `your_helpdesk_bot`
5. **Сохраните токен** (выглядит как `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### 4. **Настройка переменных окружения**

```bash
# Скопируйте пример файла
cp .env.example .env

# Отредактируйте .env файл
nano .env
```

**Добавьте в .env:**
```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_BOT_USERNAME=your_helpdesk_bot

# URLs
FRONTEND_URL=https://your-username.github.io/helpdesk-park-app
API_URL=https://your-api-url.com/api

# Environment
NODE_ENV=production
```

### 5. **Настройка бота**

```bash
# Настройка команд и меню
node setup-bot.js

# Настройка Mini App
node setup-miniapp-final.js
```

## 🔧 Полная адаптация под свои нужды

### **Изменение названия и брендинга**

#### 1. **Обновление package.json**
```json
{
  "name": "your-helpdesk-app",
  "description": "Ваша система управления заявками"
}
```

#### 2. **Изменение названия в коде**
- `frontend/src/App.tsx` - заголовок приложения
- `README.md` - описание проекта
- `frontend/index.html` - title страницы

#### 3. **Обновление логотипа и иконок**
- Замените файлы в `frontend/public/`
- Обновите `frontend/index.html`

### **Кастомизация функциональности**

#### 1. **Изменение полей заявок**
```typescript
// src/tickets/dto/create-ticket.dto.ts
export class CreateTicketDto {
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  // Добавьте свои поля:
  // category: string;
  // department: string;
  // customField: string;
}
```

#### 2. **Обновление схемы базы данных**
```prisma
// prisma/schema.prisma
model Ticket {
  id          String   @id @default(cuid())
  title       String
  description String
  priority    Priority
  status      Status   @default(NEW)
  // Добавьте свои поля:
  // category    String?
  // department  String?
  // customField String?
}
```

#### 3. **Изменение статусов заявок**
```typescript
// src/tickets/entities/ticket.entity.ts
export enum TicketStatus {
  NEW = 'NEW',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  // Добавьте свои статусы:
  // REVIEW = 'REVIEW',
  // APPROVED = 'APPROVED',
}
```

### **Настройка уведомлений**

#### 1. **Кастомизация сообщений**
```typescript
// src/telegram/unified-telegram.service.ts
private getNotificationEmoji(type: string): string {
  const emojiMap: Record<string, string> = {
    'ASSIGNED': '👤',
    'STATUS_CHANGED': '🔄',
    'COMMENT_ADDED': '💬',
    // Добавьте свои эмодзи:
    // 'CUSTOM_EVENT': '🎯',
  };
  return emojiMap[type] || emojiMap.default;
}
```

#### 2. **Настройка каналов уведомлений**
```typescript
// Создание групп для уведомлений
const supportGroup = await telegramService.createSupportGroup(
  'IT Support Team',
  [111111111, 222222222],
  '🚀 Добро пожаловать в команду поддержки!'
);
```

## 🌐 Деплой проекта

### **Frontend на GitHub Pages**

#### 1. **Создание собственного репозитория**
```bash
# Создайте новый репозиторий на GitHub
# Затем обновите remote:
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
```

#### 2. **Настройка GitHub Pages**
1. Перейдите в **Settings** репозитория
2. Найдите раздел **Pages**
3. Установите **Source:** "GitHub Actions"
4. Сохраните настройки

#### 3. **Обновление URL в коде**
```typescript
// frontend/src/services/telegramApi.ts
const FRONTEND_URL = 'https://YOUR_USERNAME.github.io/YOUR_REPO';
```

### **Backend на Render/Vercel**

#### 1. **Подготовка к деплою**
```bash
# Создайте .env файл для production
cp .env.example .env.production

# Добавьте переменные окружения:
# - DATABASE_URL (PostgreSQL)
# - TELEGRAM_BOT_TOKEN
# - JWT_SECRET
```

#### 2. **Настройка Render**
1. Подключите репозиторий к Render
2. Выберите **Web Service**
3. Установите переменные окружения
4. Деплой запустится автоматически

## 📱 Настройка Telegram Mini App

### **1. Настройка через @BotFather**

```bash
# Отправьте @BotFather:
/setmenubutton
# Выберите вашего бота
# Введите текст: 🚀 Your Helpdesk App
# Введите URL: https://your-username.github.io/helpdesk-park-app
```

### **2. Настройка команд бота**

```bash
# Запустите скрипт настройки
node setup-bot.js

# Или настройте вручную через @BotFather:
/setcommands
# Выберите бота
# Добавьте команды:
# start - 🚀 Запустить Helpdesk
# help - ❓ Помощь
# tickets - 📋 Мои заявки
# create - ➕ Создать заявку
```

### **3. Тестирование Mini App**

1. Найдите бота в Telegram
2. Отправьте `/start`
3. Нажмите кнопку меню
4. Должно открыться полноценное приложение

## 🔍 Структура кода - что где находится

### **Frontend (React + TypeScript)**

#### **Основные файлы:**
- `src/App.tsx` - главный компонент с роутингом
- `src/main.tsx` - точка входа приложения
- `src/index.html` - HTML шаблон

#### **Компоненты:**
- `src/components/Layout.tsx` - основной макет
- `src/components/NotificationProvider.tsx` - уведомления
- `src/components/MemberSelector.tsx` - выбор участников

#### **Страницы:**
- `src/pages/LoginPage.tsx` - авторизация
- `src/pages/DashboardPage.tsx` - главная страница
- `src/pages/TicketsPage.tsx` - список заявок
- `src/pages/CreateTicketPage.tsx` - создание заявки
- `src/pages/TicketDetailPage.tsx` - детали заявки

#### **Хуки:**
- `src/hooks/useTelegram.ts` - интеграция с Telegram
- `src/hooks/useChatId.ts` - работа с chat ID
- `src/hooks/useChatMembers.ts` - участники чата

#### **Сервисы:**
- `src/services/telegramApi.ts` - API Telegram
- `src/stores/authStore.ts` - состояние авторизации

### **Backend (NestJS)**

#### **Основные файлы:**
- `src/main.ts` - точка входа сервера
- `src/app.module.ts` - главный модуль

#### **Модули:**
- `src/auth/` - аутентификация и авторизация
- `src/tickets/` - логика заявок
- `src/users/` - управление пользователями
- `src/telegram/` - интеграция с Telegram
- `src/notifications/` - система уведомлений

#### **Структура модуля:**
```
src/tickets/
├── tickets.controller.ts    # REST API endpoints
├── tickets.service.ts       # Бизнес-логика
├── tickets.module.ts        # Конфигурация модуля
├── dto/                     # Data Transfer Objects
├── entities/                # Сущности базы данных
└── tickets.repository.ts    # Работа с БД
```

### **База данных (Prisma)**

#### **Основные файлы:**
- `prisma/schema.prisma` - схема базы данных
- `prisma/seed.ts` - начальные данные

#### **Основные модели:**
```prisma
model User {
  id                String    @id @default(cuid())
  telegramId        String    @unique
  firstName         String
  lastName          String?
  username          String?
  // ... другие поля
}

model Ticket {
  id          String   @id @default(cuid())
  title       String
  description String
  status      Status   @default(NEW)
  priority    Priority
  // ... другие поля
}
```

## 🛠️ Полезные команды

### **Разработка**

```bash
# Frontend разработка
cd frontend
npm run dev          # Запуск dev сервера
npm run build        # Сборка для production
npm run preview      # Предварительный просмотр

# Backend разработка
npm run start:dev    # Запуск в режиме разработки
npm run build        # Сборка
npm run start:prod   # Запуск в production

# База данных
npx prisma migrate dev     # Применение миграций
npx prisma generate        # Генерация Prisma клиента
npx prisma studio          # Веб-интерфейс для БД
npx prisma db seed         # Заполнение начальными данными
```

### **Тестирование бота**

```bash
# Простой тест бота
node simple-bot-test.js

# Настройка бота
node setup-bot.js

# Настройка Mini App
node setup-miniapp-final.js

# Исправление webhook
node fix-webhook.js
```

### **Git команды**

```bash
# Обновление репозитория
git add .
git commit -m "Описание изменений"
git push origin main

# Создание новой ветки
git checkout -b feature/new-feature
git push origin feature/new-feature
```

## 🔒 Безопасность и переменные окружения

### **Обязательные переменные:**

```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_BOT_USERNAME=your_bot_username

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# JWT
JWT_SECRET=your-super-secret-jwt-key

# URLs
FRONTEND_URL=https://your-domain.com
API_URL=https://your-api-domain.com/api
```

### **Рекомендации по безопасности:**

1. **Никогда не коммитьте** `.env` файлы
2. **Используйте сильные пароли** для JWT_SECRET
3. **Ограничьте доступ** к базе данных
4. **Регулярно обновляйте** зависимости
5. **Используйте HTTPS** для production

## 📚 Дополнительные ресурсы

### **Документация технологий:**
- [React Documentation](https://react.dev/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Telegram WebApp API](https://core.telegram.org/bots/webapps)
- [Vite Documentation](https://vitejs.dev/)

### **Полезные ссылки:**
- [GitHub Pages](https://pages.github.com/)
- [Render](https://render.com/)
- [Vercel](https://vercel.com/)
- [Supabase](https://supabase.com/) (альтернатива PostgreSQL)

## 🆘 Решение проблем

### **Частые проблемы:**

#### 1. **Бот не отвечает на команды**
```bash
# Решение:
node fix-webhook.js
node setup-bot.js
```

#### 2. **Ошибки TypeScript при сборке**
```bash
# Решение:
cd frontend
npm install
npm run build
```

#### 3. **Проблемы с базой данных**
```bash
# Решение:
npx prisma migrate reset
npx prisma migrate dev
npx prisma generate
```

#### 4. **GitHub Pages не обновляется**
- Проверьте настройки Pages в Settings
- Убедитесь, что Source установлен как "GitHub Actions"
- Проверьте логи в Actions

#### 5. **Mini App не открывается**
- Проверьте URL в настройках бота
- Убедитесь, что сайт доступен по HTTPS
- Проверьте настройки через @BotFather

### **Отладка:**

```bash
# Проверка логов
tail -f logs/app.log

# Проверка статуса бота
node debug-bot.js

# Тестирование API
curl -X GET https://your-api.com/api/health
```

## 📞 Поддержка

Если возникли вопросы:

1. **Проверьте логи** в консоли браузера и терминале
2. **Убедитесь**, что все зависимости установлены
3. **Проверьте переменные окружения**
4. **Создайте issue** в репозитории GitHub
5. **Обратитесь к документации** технологий

---

## 🎉 Заключение

**Helpdesk Park** - это полноценная система управления заявками, готовая к использованию и адаптации под любые нужды. Проект включает:

- ✅ **Современный стек технологий**
- ✅ **Telegram Mini App интеграцию**
- ✅ **Автоматический деплой**
- ✅ **Подробную документацию**
- ✅ **Готовность к масштабированию**

**Удачи в адаптации проекта под свои нужды!** 🚀

---

*Создано командой Helpdesk Park Team* 🎠
