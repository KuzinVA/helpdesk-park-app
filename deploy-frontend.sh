#!/bin/bash

echo "🚀 Deploying Helpdesk Park Frontend to GitHub Pages..."

# Переключаемся на main ветку
echo "📋 Switching to main branch..."
git checkout main

# Собираем frontend
echo "🔨 Building frontend..."
cd frontend
npm run build
cd ..

# Добавляем все изменения
echo "📝 Adding changes..."
git add .

# Коммитим изменения
echo "💾 Committing changes..."
git commit -m "🚀 Deploy frontend with Apple-style design and Telegram Mini App integration"

# Пушим в main ветку
echo "📤 Pushing to main branch..."
git push origin main

echo "✅ Frontend deployment initiated!"
echo "🌐 GitHub Pages will be available at: https://kuzinva.github.io/helpdesk-park-app/"
echo "📱 Telegram Mini App will work with the new design!"
echo ""
echo "⏳ Wait a few minutes for GitHub Actions to complete the deployment."
