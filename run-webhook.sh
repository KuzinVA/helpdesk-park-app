#!/bin/bash

echo "🚀 Запуск Helpdesk Webhook сервера..."

# Проверяем наличие Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен. Установите Node.js 18+"
    exit 1
fi

# Проверяем версию Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Требуется Node.js 18+. Текущая версия: $(node -v)"
    exit 1
fi

echo "✅ Node.js версия: $(node -v)"

# Устанавливаем зависимости если нужно
if [ ! -d "node_modules" ]; then
    echo "📦 Устанавливаю зависимости..."
    npm install --prefix . --package-lock-only
    npm install
fi

echo "🌐 Запускаю webhook сервер..."
echo "📱 Мини-апп: http://localhost:3001/index-github.html"
echo "🔗 Webhook: http://localhost:3001/webhook"
echo ""
echo "⏹️  Для остановки: Ctrl+C"

node simple-webhook.js
