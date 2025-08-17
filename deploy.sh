#!/bin/bash

# 🚀 Скрипт развертывания Helpdesk Park на GitHub Pages

echo "🚀 Развертывание Helpdesk Park на GitHub Pages..."

# Проверяем наличие git
if ! command -v git &> /dev/null; then
    echo "❌ Git не установлен. Установите git и попробуйте снова."
    exit 1
fi

# Проверяем, что мы в git репозитории
if [ ! -d ".git" ]; then
    echo "❌ Это не git репозиторий. Сначала инициализируйте git:"
    echo "   git init"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/helpdesk-park-app.git"
    exit 1
fi

# Копируем продакшен файл как index.html
echo "📁 Копируем продакшен файлы..."
cp frontend/production.html index.html
cp frontend/simple-test.html test.html

# Создаем README.md если его нет
if [ ! -f "README.md" ]; then
    echo "📝 Создаем README.md..."
    cat > README.md << 'EOF'
# 🚀 Helpdesk Park - Telegram Mini App

Система управления заявками парка аттракционов, доступная прямо в Telegram.

## 🌐 Демо

- [Основное приложение](https://YOUR_USERNAME.github.io/helpdesk-park-app/)
- [Тестовая страница](https://YOUR_USERNAME.github.io/helpdesk-park-app/test.html)

## 📱 Telegram бот

@helpdeskParkApp_bot

## 🚀 Возможности

- 📋 Управление заявками
- ➕ Создание новых заявок
- 📊 Статистика и аналитика
- 👤 Профиль пользователя
- 🔔 Уведомления

## 🛠️ Технологии

- HTML5 + CSS3 + JavaScript
- Telegram WebApp API
- Tailwind CSS
- Адаптивный дизайн

## 📞 Поддержка

По вопросам обращайтесь к разработчику.
EOF
fi

# Добавляем файлы в git
echo "📦 Добавляем файлы в git..."
git add .

# Проверяем статус
echo "📊 Статус git:"
git status

# Коммитим изменения
echo "💾 Коммитим изменения..."
git commit -m "🚀 Deploy to GitHub Pages: Helpdesk Park Telegram Mini App"

# Пушим изменения
echo "🚀 Пушим изменения на GitHub..."
git push origin main

echo ""
echo "✅ Развертывание завершено!"
echo ""
echo "📋 Следующие шаги:"
echo "1. Перейдите в Settings вашего GitHub репозитория"
echo "2. Прокрутите до 'Pages'"
echo "3. В 'Source' выберите 'Deploy from a branch'"
echo "4. Выберите ветку 'main' и папку '/ (root)'"
echo "5. Нажмите 'Save'"
echo ""
echo "🌐 После настройки Pages ваше приложение будет доступно по адресу:"
echo "   https://YOUR_USERNAME.github.io/helpdesk-park-app/"
echo ""
echo "📱 Не забудьте обновить URL в боте после получения финального URL!"
echo ""
echo "🎉 Удачи с развертыванием!"
