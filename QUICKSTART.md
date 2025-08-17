# 🚀 Быстрый старт Helpdesk Park App

## 📋 Предварительные требования

- Docker и Docker Compose установлены
- Telegram Bot создан (через @BotFather)

## ⚡ Быстрый запуск

### 1. Настройка Telegram Bot
```bash
# Создайте бота через @BotFather
# Получите токен и username
# Добавьте команду /start в боте
```

### 2. Настройка окружения
```bash
# Скопируйте файл окружения
cp .env.example .env

# Отредактируйте .env файл
nano .env

# Добавьте ваши данные:
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_BOT_USERNAME=your_bot_name
```

### 3. Запуск приложения
```bash
# Автоматический запуск всех сервисов
./start.sh

# Или вручную:
docker-compose up -d
```

### 4. Проверка работы
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Swagger: http://localhost:3000/api
- MinIO Console: http://localhost:9002

## 🔧 Ручная настройка

### Backend
```bash
cd backend
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📱 Тестирование Mini App

1. Откройте вашего бота в Telegram
2. Отправьте команду /start
3. Нажмите кнопку "Открыть приложение"
4. Приложение откроется в Telegram

## 🐛 Устранение проблем

### Сервисы не запускаются
```bash
# Проверьте логи
docker-compose logs

# Перезапустите
docker-compose down && docker-compose up -d
```

### База данных не подключается
```bash
# Проверьте статус PostgreSQL
docker-compose ps postgres

# Сбросьте базу
cd backend && npm run db:reset
```

### Frontend не загружается
```bash
# Проверьте логи frontend
docker-compose logs frontend

# Проверьте доступность backend
curl http://localhost:3000/health
```

## 📚 Следующие шаги

1. Создайте тестовые заявки
2. Настройте роли пользователей
3. Протестируйте уведомления
4. Настройте SLA политики

## 🆘 Поддержка

- Проверьте логи: `docker-compose logs -f`
- Создайте Issue в репозитории
- Опишите проблему и приложите логи
