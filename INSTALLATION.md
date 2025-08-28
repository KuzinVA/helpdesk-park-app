# 🚀 Быстрая установка Helpdesk Park

## 📋 Требования
- Node.js 18+
- PostgreSQL 12+
- Redis (для очередей)
- Telegram Bot Token

## ⚡ Быстрый старт

### 1. Установка зависимостей
```bash
# Backend
npm install

# Frontend
cd frontend
npm install
```

### 2. Настройка базы данных
```bash
# Создание .env файла
cp env.example .env
# Отредактируйте .env с вашими данными

# Миграции и seed
npx prisma migrate dev
npx prisma db seed
```

### 3. Запуск
```bash
# Backend (терминал 1)
npm run start:dev

# Frontend (терминал 2)
cd frontend
npm run dev
```

### 4. Настройка Telegram бота
1. Создайте бота через @BotFather
2. Получите токен и username
3. Добавьте в .env файл
4. Установите webhook: `GET /telegram/webhook/set/your_url`

## 🌐 Доступ
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- API Docs: http://localhost:3000/api

## 📱 Тестирование Mini App
1. Найдите бота в Telegram
2. Отправьте `/start`
3. Нажмите "Открыть приложение"

**Подробная документация в DELIVERY_README.md**
