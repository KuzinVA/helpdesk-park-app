#!/bin/bash

echo "🤖 Настройка Telegram Bot для Helpdesk Park App..."

# Проверяем наличие .env файла
if [ ! -f ".env" ]; then
    echo "❌ Файл .env не найден. Создайте его из .env.example"
    exit 1
fi

# Загружаем переменные окружения
source .env

# Проверяем наличие токена
if [ -z "$TELEGRAM_BOT_TOKEN" ]; then
    echo "❌ TELEGRAM_BOT_TOKEN не найден в .env файле"
    exit 1
fi

echo "✅ Токен бота найден: ${TELEGRAM_BOT_TOKEN:0:10}..."

# Получаем информацию о боте
echo "📋 Получаю информацию о боте..."
BOT_INFO=$(curl -s "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getMe")
BOT_USERNAME=$(echo $BOT_INFO | python3 -c "import sys, json; print(json.load(sys.stdin)['result']['username'])")

if [ -z "$BOT_USERNAME" ]; then
    echo "❌ Не удалось получить username бота"
    exit 1
fi

echo "✅ Бот найден: @$BOT_USERNAME"

# Проверяем текущий webhook
echo "🔍 Проверяю текущий webhook..."
WEBHOOK_INFO=$(curl -s "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getWebhookInfo")
CURRENT_URL=$(echo $WEBHOOK_INFO | python3 -c "import sys, json; print(json.load(sys.stdin)['result']['url'])")

if [ "$CURRENT_URL" != "" ]; then
    echo "⚠️  Текущий webhook: $CURRENT_URL"
    read -p "Удалить текущий webhook? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🗑️  Удаляю текущий webhook..."
        curl -s "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/deleteWebhook"
        echo "✅ Webhook удален"
    fi
fi

# Устанавливаем новый webhook
echo "🔗 Устанавливаю webhook..."
WEBHOOK_URL="https://your-domain.com/telegram/webhook"  # Замените на ваш домен

read -p "Введите URL для webhook (или нажмите Enter для localhost:3000): " -r
if [ -z "$REPLY" ]; then
    WEBHOOK_URL="http://localhost:3000/telegram/webhook"
else
    WEBHOOK_URL="$REPLY"
fi

echo "🔗 Устанавливаю webhook: $WEBHOOK_URL"
WEBHOOK_RESPONSE=$(curl -s -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
    -H "Content-Type: application/json" \
    -d "{\"url\": \"$WEBHOOK_URL\"}")

WEBHOOK_OK=$(echo $WEBHOOK_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['ok'])")

if [ "$WEBHOOK_OK" = "True" ]; then
    echo "✅ Webhook успешно установлен!"
else
    echo "❌ Ошибка установки webhook: $WEBHOOK_RESPONSE"
    exit 1
fi

# Проверяем webhook
echo "🔍 Проверяю установленный webhook..."
NEW_WEBHOOK_INFO=$(curl -s "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getWebhookInfo")
NEW_URL=$(echo $NEW_WEBHOOK_INFO | python3 -c "import sys, json; print(json.load(sys.stdin)['result']['url'])")

echo "✅ Webhook установлен: $NEW_URL"

# Инструкции по тестированию
echo ""
echo "🎯 Настройка завершена!"
echo ""
echo "📱 Для тестирования:"
echo "1. Откройте @$BOT_USERNAME в Telegram"
echo "2. Отправьте команду /start"
echo "3. Нажмите кнопку 'Открыть приложение'"
echo ""
echo "🔧 Для изменения webhook:"
echo "curl -X POST \"https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook\" \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -d '{\"url\": \"НОВЫЙ_URL\"}'"
echo ""
echo "🗑️  Для удаления webhook:"
echo "curl \"https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/deleteWebhook\""
