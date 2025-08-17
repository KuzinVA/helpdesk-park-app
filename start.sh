#!/bin/bash

echo "�� Запуск Helpdesk Park App..."

# Проверяем наличие Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Установите Docker и Docker Compose."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose не установлен. Установите Docker Compose."
    exit 1
fi

# Проверяем наличие .env файла
if [ ! -f ".env" ]; then
    echo "⚠️  Файл .env не найден. Создаю из примера..."
    cp .env.example .env
    echo "📝 Отредактируйте .env файл с вашими настройками и запустите скрипт снова."
    exit 1
fi

# Останавливаем существующие контейнеры
echo "🛑 Останавливаю существующие контейнеры..."
docker-compose down

# Собираем и запускаем
echo "🔨 Собираю и запускаю сервисы..."
docker-compose up --build -d

# Ждем запуска
echo "⏳ Жду запуска сервисов..."
sleep 10

# Проверяем статус
echo "📊 Статус сервисов:"
docker-compose ps

echo ""
echo "✅ Helpdesk Park App запущен!"
echo ""
echo "🌐 Доступные сервисы:"
echo "   Frontend: http://localhost:5173"
echo "   Backend API: http://localhost:3000"
echo "   Swagger: http://localhost:3000/api"
echo "   MinIO Console: http://localhost:9002"
echo "   PostgreSQL: localhost:5432"
echo ""
echo "�� Для остановки: docker-compose down"
echo "📋 Для просмотра логов: docker-compose logs -f"
