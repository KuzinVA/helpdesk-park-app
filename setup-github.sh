#!/bin/bash

# 🚀 Скрипт настройки GitHub репозитория для Helpdesk Park

echo "🚀 Настройка GitHub репозитория для Helpdesk Park..."
echo ""

# Проверяем, что мы в git репозитории
if [ ! -d ".git" ]; then
    echo "❌ Это не git репозиторий. Сначала инициализируйте git:"
    echo "   git init"
    exit 1
fi

# Проверяем, есть ли уже remote origin
if git remote get-url origin &> /dev/null; then
    echo "📡 Remote origin уже настроен:"
    git remote get-url origin
    echo ""
    echo "Хотите изменить его? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo "Введите новый URL репозитория:"
        read -r new_url
        git remote set-url origin "$new_url"
        echo "✅ Remote origin обновлен"
    else
        echo "✅ Используем существующий remote origin"
    fi
else
    echo "📡 Remote origin не настроен."
    echo ""
    echo "Введите URL вашего GitHub репозитория:"
    echo "Пример: https://github.com/YOUR_USERNAME/helpdesk-park-app.git"
    read -r repo_url
    
    if [[ -n "$repo_url" ]]; then
        git remote add origin "$repo_url"
        echo "✅ Remote origin добавлен: $repo_url"
    else
        echo "❌ URL не может быть пустым"
        exit 1
    fi
fi

echo ""
echo "📊 Статус git:"
git status

echo ""
echo "🌐 Теперь вы можете:"
echo "1. Запустить развертывание: ./deploy.sh"
echo "2. Или сделать push вручную:"
echo "   git push -u origin main"
echo ""
echo "📱 После развертывания не забудьте обновить URL в боте!"
echo ""
echo "🎉 Удачи с развертыванием!"
