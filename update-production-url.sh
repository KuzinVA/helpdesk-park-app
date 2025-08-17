#!/bin/bash

if [ -z "$1" ]; then
    echo "❌ Укажите новый URL API"
    echo "Пример: ./update-production-url.sh https://abc123.ngrok.io"
    exit 1
fi

NEW_URL=$1
echo "🔄 Обновляем URL API в production.html на: $NEW_URL"

# Обновляем все вхождения localhost:3001 на новый URL
sed -i '' "s|http://localhost:3001|$NEW_URL|g" frontend/production.html
sed -i '' "s|https://helpdesk-park-app.onrender.com|$NEW_URL|g" frontend/production.html

echo "✅ URL обновлен в frontend/production.html"
echo "📱 Теперь мини-приложение будет использовать: $NEW_URL"

# Коммитим изменения
git add frontend/production.html
git commit -m "🔄 Update API URL to $NEW_URL"
git push origin main

echo "🚀 Изменения отправлены в GitHub Pages"
echo "🌐 Мини-приложение будет автоматически обновлено"
