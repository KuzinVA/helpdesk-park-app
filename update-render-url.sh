#!/bin/bash

if [ -z "$1" ]; then
    echo "❌ Укажите URL Render API"
    echo "Пример: ./update-render-url.sh https://helpdesk-chat-api.onrender.com"
    exit 1
fi

RENDER_URL=$1
echo "🔄 Обновляем URL Render API в production.html на: $RENDER_URL"

# Обновляем все вхождения localhost:3001 на Render URL
sed -i '' "s|http://localhost:3001|$RENDER_URL|g" frontend/production.html
sed -i '' "s|https://helpdesk-park-app.onrender.com|$RENDER_URL|g" frontend/production.html

echo "✅ URL обновлен в frontend/production.html"
echo "📱 Теперь мини-приложение будет использовать: $RENDER_URL"

# Коммитим изменения
git add frontend/production.html
git commit -m "🔄 Update API URL to Render.com: $RENDER_URL"
git push origin main

echo "🚀 Изменения отправлены в GitHub Pages"
echo "🌐 Мини-приложение будет автоматически обновлено"
echo ""
echo "🎯 Теперь у вас есть полностью рабочий продакшен с реальными данными!"
