# 🎡 Helpdesk Park - Готовое приложение

## 🚀 **Быстрый старт**

### **1. Установка зависимостей**
```bash
npm install
cd frontend && npm install
```

### **2. Настройка базы данных**
```bash
# Создайте .env файл на основе env.example
cp env.example .env

# Запустите миграции
npx prisma migrate dev
npx prisma db seed
```

### **3. Запуск приложения**
```bash
# Backend (терминал 1)
npm run start:dev

# Frontend (терминал 2)
cd frontend && npm run dev
```

### **4. Настройка Telegram бота**
1. Создайте бота через @BotFather
2. Получите токен и username
3. Добавьте в .env файл
4. Установите webhook: `GET /telegram/webhook/set/your_url`

## 📱 **Тестирование Mini App**
1. Найдите бота в Telegram
2. Отправьте `/start`
3. Нажмите "Открыть приложение"

## 📚 **Документация**
- [Подробная инструкция](DELIVERY_README.md)
- [Быстрая установка](INSTALLATION.md)
- [Настройка Telegram](BOTFATHER_SETUP.md)
- [Тестирование Mini App](MINI_APP_TEST.md)

## 🌐 **Доступ**
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- API Docs: http://localhost:3000/api

## 🎯 **Готово к использованию!**
