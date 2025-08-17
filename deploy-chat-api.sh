#!/bin/bash

echo "🚀 Развертывание Chat API в продакшен..."

# Остановка всех локальных процессов
echo "🛑 Останавливаем локальные процессы..."
pkill -f "node.*bot\|node.*api" || echo "Процессы остановлены"

# Проверка git статуса
echo "📋 Проверяем git статус..."
if [[ $(git status --porcelain) ]]; then
    echo "⚠️ Есть несохраненные изменения. Коммитим..."
    git add .
    git commit -m "🚀 Prepare Chat API for production deployment"
fi

# Push в GitHub
echo "📤 Push в GitHub..."
git push origin main

echo ""
echo "✅ Код отправлен в GitHub!"
echo ""
echo "🔧 Теперь выполните следующие шаги:"
echo ""
echo "1. Перейдите на https://render.com"
echo "2. Создайте аккаунт через GitHub"
echo "3. Нажмите 'New +' → 'Web Service'"
echo "4. Подключите репозиторий: KuzinVA/helpdesk-park-app"
echo "5. Настройте сервис:"
echo "   - Name: helpdesk-chat-api"
echo "   - Environment: Node"
echo "   - Build Command: npm install"
echo "   - Start Command: node chat-api.js"
echo "6. Добавьте переменные окружения:"
echo "   - BOT_TOKEN = 8465643840:AAEWFjl1h-EY3150NgihSG2HAaVYLci14Rk"
echo "   - NODE_ENV = production"
echo "   - PORT = 10000"
echo ""
echo "🌐 После развертывания получите URL и обновите production.html"
echo ""
echo "📱 Для тестирования используйте:"
echo "   curl 'https://your-api-url.onrender.com/api/health'"
echo "   curl 'https://your-api-url.onrender.com/api/chat-members?chat_id=-1002978831408'"
echo ""
echo "🎯 Результат: реальные участники чата в мини-приложении!"
