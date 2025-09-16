# 🚀 Helpdesk Park - Руководство по запуску

## 📋 Что это за проект?

**Helpdesk Park** - система управления заявками с Telegram Mini App интеграцией. Позволяет создавать, отслеживать и управлять заявками через Telegram.

## 🏗️ Архитектура проекта

```
helpdesk-park-app/
├── frontend/          # React + TypeScript + Vite
├── src/               # NestJS Backend
├── prisma/            # База данных (PostgreSQL)
└── python-mcp/        # MCP интеграция
```

## 🚀 Быстрый запуск

### 1. **Клонирование проекта**
```bash
git clone https://github.com/KuzinVA/helpdesk-park-app.git
cd helpdesk-park-app
```

### 2. **Настройка Frontend**
```bash
cd frontend
npm install
npm run build
```

### 3. **Настройка Telegram бота**
1. Создайте бота через @BotFather
2. Получите токен бота
3. Скопируйте `.env.example` в `.env`
4. Добавьте токен в `.env`:
```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
```

## 🔧 Настройка для собственного использования

### **Шаг 1: Создание Telegram бота**
1. Найдите @BotFather в Telegram
2. Отправьте `/newbot`
3. Следуйте инструкциям
4. Сохраните токен

### **Шаг 2: Настройка переменных окружения**
```bash
cp .env.example .env
# Отредактируйте .env файл
```

### **Шаг 3: Адаптация под свои нужды**

#### **Изменение названия проекта:**
1. В `frontend/package.json` - измените `name`
2. В `package.json` - измените `name` и `description`
3. В `README.md` - обновите описание

#### **Изменение функциональности:**
1. `src/tickets/` - логика заявок
2. `src/users/` - управление пользователями
3. `src/telegram/` - интеграция с Telegram

### **Шаг 4: Деплой**

#### **Frontend на GitHub Pages:**
1. Создайте свой репозиторий на GitHub
2. Настройте GitHub Pages в настройках репозитория
3. Запушьте код:
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push origin main
```

## 🔍 Структура кода

### **Frontend (React + TypeScript):**
- `src/App.tsx` - главный компонент
- `src/pages/` - страницы приложения
- `src/components/` - переиспользуемые компоненты
- `src/hooks/` - кастомные хуки
- `src/services/` - API сервисы

### **Backend (NestJS):**
- `src/main.ts` - точка входа
- `src/app.module.ts` - главный модуль
- `src/tickets/` - модуль заявок
- `src/users/` - модуль пользователей
- `src/telegram/` - модуль Telegram

### **База данных (Prisma):**
- `prisma/schema.prisma` - схема БД
- `prisma/seed.ts` - начальные данные

## 🚨 Важные файлы для понимания

1. **`frontend/src/App.tsx`** - основная логика фронтенда
2. **`src/main.ts`** - точка входа бэкенда
3. **`prisma/schema.prisma`** - структура базы данных
4. **`src/telegram/unified-telegram.service.ts`** - интеграция с Telegram

## 🛠️ Полезные команды

```bash
# Разработка фронтенда
cd frontend && npm run dev

# Разработка бэкенда
npm run start:dev

# Сборка фронтенда
cd frontend && npm run build

# Миграции БД
npx prisma migrate dev

# Генерация Prisma клиента
npx prisma generate
```

## 📱 Telegram Mini App настройка

### **Настройка webhook:**
```bash
node setup-bot.js
```

### **Настройка меню бота:**
```bash
node setup-miniapp-final.js
```

## 📚 Дополнительные ресурсы

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Telegram WebApp API](https://core.telegram.org/bots/webapps)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [React Documentation](https://react.dev/)

## 🆘 Поддержка

Если возникли вопросы:
1. Проверьте логи в консоли
2. Убедитесь, что все зависимости установлены
3. Проверьте переменные окружения
4. Создайте issue в репозитории

---

**Удачи в адаптации проекта под свои нужды!** 🚀