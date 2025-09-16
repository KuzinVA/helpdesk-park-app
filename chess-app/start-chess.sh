#!/bin/bash

echo "🎮 Запуск шахматного приложения..."
echo ""

# Проверяем, установлен ли Expo CLI
if ! command -v expo &> /dev/null; then
    echo "📦 Устанавливаем Expo CLI..."
    npm install -g @expo/cli
fi

# Переходим в папку проекта
cd chess-app

# Устанавливаем зависимости, если нужно
if [ ! -d "node_modules" ]; then
    echo "📦 Устанавливаем зависимости..."
    npm install
fi

echo "🚀 Запускаем приложение..."
echo ""
echo "📱 Варианты запуска:"
echo "   • Нажмите 'a' для запуска на Android эмуляторе"
echo "   • Нажмите 'i' для запуска на iOS симуляторе (только macOS)"
echo "   • Нажмите 'w' для запуска веб-версии"
echo "   • Отсканируйте QR-код в приложении Expo Go на телефоне"
echo ""

# Запускаем Expo
npx expo start

