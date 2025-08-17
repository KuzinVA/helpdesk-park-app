#!/bin/bash

echo "🚀 Запуск Helpdesk Mini App..."

# Проверяем наличие Python
if command -v python3 &> /dev/null; then
    echo "✅ Python3 найден"
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    echo "✅ Python найден"
    PYTHON_CMD="python"
else
    echo "❌ Python не найден. Установите Python для запуска локального сервера"
    exit 1
fi

echo "🌐 Запускаю локальный сервер..."
echo "📱 Откройте: http://localhost:8000"
echo "📱 Или: http://localhost:8000/frontend/index-simple.html"
echo ""
echo "🔗 Для настройки Telegram бота:"
echo "1. Откройте @helpdeskParkApp_bot в Telegram"
echo "2. Отправьте /start"
echo "3. Нажмите кнопку 'Открыть приложение'"
echo ""
echo "⏹️  Для остановки: Ctrl+C"

cd frontend
$PYTHON_CMD -m http.server 8000
