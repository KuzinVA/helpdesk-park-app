#!/bin/bash

# Скрипт для установки и настройки MCP сервера для Telegram Mini App
# Автор: Helpdesk Park Team

set -e

echo "🚀 Установка MCP сервера для Telegram Mini App..."

# Проверка наличия Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен. Пожалуйста, установите Node.js 18+ и попробуйте снова."
    exit 1
fi

# Проверка версии Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Требуется Node.js версии 18 или выше. Текущая версия: $(node -v)"
    exit 1
fi

echo "✅ Node.js версии $(node -v) найден"

# Создание .env файла если его нет
if [ ! -f .env ]; then
    echo "📝 Создание .env файла..."
    cat > .env << EOF
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_BOT_USERNAME=your_bot_username_here

# Frontend URL for Mini App
FRONTEND_URL=https://your-miniapp-domain.com

# Environment
NODE_ENV=development
LOG_LEVEL=info
EOF
    echo "✅ .env файл создан. Пожалуйста, отредактируйте его и добавьте ваши данные."
else
    echo "✅ .env файл уже существует"
fi

# Установка зависимостей MCP сервера
echo "📦 Установка зависимостей MCP сервера..."
if [ -f mcp-package.json ]; then
    npm install --prefix ./
else
    echo "❌ mcp-package.json не найден"
    exit 1
fi

# Проверка установки зависимостей
if [ ! -d "node_modules" ]; then
    echo "❌ Зависимости не установлены. Попробуйте запустить 'npm install' вручную."
    exit 1
fi

echo "✅ Зависимости установлены"

# Создание скриптов запуска
echo "🔧 Создание скриптов запуска..."

# Скрипт для запуска MCP сервера
cat > start-mcp.sh << 'EOF'
#!/bin/bash
echo "🚀 Запуск MCP сервера для Telegram Mini App..."
export $(cat .env | xargs)
node mcp-server.js
EOF

# Скрипт для запуска в режиме разработки
cat > dev-mcp.sh << 'EOF'
#!/bin/bash
echo "🔧 Запуск MCP сервера в режиме разработки..."
export $(cat .env | xargs)
node --watch mcp-server.js
EOF

# Скрипт для тестирования
cat > test-mcp.sh << 'EOF'
#!/bin/bash
echo "🧪 Тестирование MCP инструментов..."
export $(cat .env | xargs)
node mcp-examples.js
EOF

# Делаем скрипты исполняемыми
chmod +x start-mcp.sh dev-mcp.sh test-mcp.sh

echo "✅ Скрипты запуска созданы"

# Проверка конфигурации
echo "🔍 Проверка конфигурации..."

# Проверка наличия обязательных переменных в .env
if grep -q "your_bot_token_here" .env; then
    echo "⚠️  ВНИМАНИЕ: TELEGRAM_BOT_TOKEN не настроен в .env файле"
    echo "   Пожалуйста, отредактируйте .env файл и добавьте ваш токен бота"
fi

if grep -q "your_bot_username_here" .env; then
    echo "⚠️  ВНИМАНИЕ: TELEGRAM_BOT_USERNAME не настроен в .env файле"
    echo "   Пожалуйста, отредактируйте .env файл и добавьте username вашего бота"
fi

if grep -q "your-miniapp-domain.com" .env; then
    echo "⚠️  ВНИМАНИЕ: FRONTEND_URL не настроен в .env файле"
    echo "   Пожалуйста, отредактируйте .env файл и добавьте URL вашего Mini App"
fi

# Создание инструкции по настройке
echo "📚 Создание инструкции по настройке..."
cat > SETUP_INSTRUCTIONS.md << 'EOF'
# Инструкция по настройке MCP сервера

## 🚀 Быстрый старт

1. **Настройте переменные окружения** в файле `.env`:
   - `TELEGRAM_BOT_TOKEN` - токен вашего Telegram бота
   - `TELEGRAM_BOT_USERNAME` - username вашего бота
   - `FRONTEND_URL` - URL вашего Mini App

2. **Запустите MCP сервер**:
   ```bash
   ./start-mcp.sh
   ```

3. **Для разработки** (с автоперезагрузкой):
   ```bash
   ./dev-mcp.sh
   ```

4. **Тестирование**:
   ```bash
   ./test-mcp.sh
   ```

## 🔧 Настройка MCP клиента

### Для Cursor/VS Code:
Создайте конфигурацию MCP в настройках:

```json
{
  "mcpServers": {
    "telegram-miniapp": {
      "command": "node",
      "args": ["/path/to/your/project/mcp-server.js"],
      "env": {
        "TELEGRAM_BOT_TOKEN": "your_bot_token",
        "TELEGRAM_BOT_USERNAME": "your_bot_username",
        "FRONTEND_URL": "https://your-app.com"
      }
    }
  }
}
```

## 📞 Поддержка

- Документация: MCP_README.md
- Примеры: mcp-examples.js
- Проблемы: создайте Issue в репозитории
EOF

echo "✅ Инструкция по настройке создана"

# Финальная информация
echo ""
echo "🎉 Установка MCP сервера завершена!"
echo ""
echo "📋 Следующие шаги:"
echo "1. Отредактируйте .env файл и добавьте ваши данные"
echo "2. Запустите сервер: ./start-mcp.sh"
echo "3. Протестируйте: ./test-mcp.sh"
echo "4. Настройте MCP клиент согласно SETUP_INSTRUCTIONS.md"
echo ""
echo "📚 Документация: MCP_README.md"
echo "🔧 Примеры: mcp-examples.js"
echo ""

# Проверка готовности к запуску
if ! grep -q "your_bot_token_here" .env; then
    echo "✅ Сервер готов к запуску!"
else
    echo "⚠️  Сервер требует настройки переменных окружения"
fi

echo ""
echo "🚀 Счастливого кодирования с MCP и Telegram Mini App!"
