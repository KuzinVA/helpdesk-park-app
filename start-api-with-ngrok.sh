#!/bin/bash

echo "🚀 Запуск Chat API с ngrok туннелем..."

# Остановка всех предыдущих процессов
echo "🛑 Останавливаем предыдущие процессы..."
pkill -f "node.*chat-api\|ngrok" || echo "Процессы остановлены"

# Запуск Chat API
echo "📡 Запускаем Chat API на порту 3001..."
node chat-api.js &
API_PID=$!

# Ждем запуска API
echo "⏳ Ждем запуска API..."
sleep 3

# Проверяем, что API запущен
if ! curl -s "http://localhost:3001/api/health" > /dev/null; then
    echo "❌ API не запустился"
    exit 1
fi

echo "✅ API запущен на порту 3001"

# Запуск ngrok
echo "🌐 Запускаем ngrok туннель..."
ngrok http 3001 > /dev/null 2>&1 &
NGROK_PID=$!

# Ждем запуска ngrok
echo "⏳ Ждем запуска ngrok..."
sleep 5

# Получаем публичный URL
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"[^"]*"' | cut -d'"' -f4)

if [ -z "$NGROK_URL" ]; then
    echo "❌ Не удалось получить ngrok URL"
    exit 1
fi

echo ""
echo "🎉 Chat API доступен по адресу:"
echo "🌐 $NGROK_URL"
echo ""
echo "📱 Обновите frontend/production.html:"
echo "   Замените все localhost:3001 на $NGROK_URL"
echo ""
echo "🧪 Тестирование:"
echo "   curl '$NGROK_URL/api/health'"
echo "   curl '$NGROK_URL/api/chat-members?chat_id=-1002978831408'"
echo ""
echo "🛑 Для остановки нажмите Ctrl+C"

# Функция очистки при выходе
cleanup() {
    echo ""
    echo "🛑 Останавливаем процессы..."
    kill $API_PID 2>/dev/null
    kill $NGROK_PID 2>/dev/null
    pkill -f "ngrok" 2>/dev/null
    echo "✅ Процессы остановлены"
    exit 0
}

# Перехват Ctrl+C
trap cleanup SIGINT

# Ждем
wait
