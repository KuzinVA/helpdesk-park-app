#!/bin/bash

echo "🧪 Тестирование Telegram Bot..."

# Проверяем наличие .env файла
if [ ! -f ".env" ]; then
    echo "❌ Файл .env не найден"
    exit 1
fi

# Загружаем переменные окружения
source .env

# Проверяем наличие токена
if [ -z "$TELEGRAM_BOT_TOKEN" ]; then
    echo "❌ TELEGRAM_BOT_TOKEN не найден"
    exit 1
fi

echo "✅ Токен найден: ${TELEGRAM_BOT_TOKEN:0:10}..."

# Получаем информацию о боте
echo "📋 Информация о боте:"
curl -s "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getMe" | python3 -m json.tool

echo ""
echo "🔗 Информация о webhook:"
curl -s "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getWebhookInfo" | python3 -m json.tool

echo ""
echo "📊 Статистика бота:"
curl -s "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getChatMemberCount" -d '{"chat_id": "@helpdeskParkApp_bot"}' 2>/dev/null | python3 -m json.tool || echo "Не удалось получить статистику"

echo ""
echo "🎯 Для тестирования:"
echo "1. Откройте @helpdeskParkApp_bot в Telegram"
echo "2. Отправьте /start"
echo "3. Проверьте ответ бота"
