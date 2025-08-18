#!/bin/bash

# Скрипт для установки интегрированной MCP системы
# Node.js MCP + Python MCP для Telegram
# Автор: Helpdesk Park Team

set -e

echo "🚀 Установка интегрированной MCP системы для Telegram..."
echo "📦 Включает: Node.js MCP (Mini App) + Python MCP (общие функции)"

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

# Проверка наличия Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 не установлен. Пожалуйста, установите Python 3.10+ и попробуйте снова."
    exit 1
fi

# Проверка версии Python
PYTHON_VERSION=$(python3 -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')")
PYTHON_MAJOR=$(echo $PYTHON_VERSION | cut -d'.' -f1)
PYTHON_MINOR=$(echo $PYTHON_VERSION | cut -d'.' -f2)

if [ "$PYTHON_MAJOR" -lt 3 ] || ([ "$PYTHON_MAJOR" -eq 3 ] && [ "$PYTHON_MINOR" -lt 10 ]); then
    echo "❌ Требуется Python 3.10 или выше. Текущая версия: $PYTHON_VERSION"
    exit 1
fi

echo "✅ Node.js версии $(node -v) найден"
echo "✅ Python версии $PYTHON_VERSION найден"

# Проверка наличия Python MCP
if [ ! -d "python-mcp" ]; then
    echo "❌ Python MCP не найден. Запустите сначала: git clone https://github.com/chigwell/telegram-mcp.git python-mcp"
    exit 1
fi

# Создание .env файла если его нет
if [ ! -f .env ]; then
    echo "📝 Создание .env файла для интегрированной системы..."
    cat > .env << EOF
# ========================================
# ИНТЕГРИРОВАННАЯ MCP СИСТЕМА TELEGRAM
# ========================================

# ========================================
# NODE.JS MCP СЕРВЕР (Mini App + Helpdesk)
# ========================================
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_BOT_USERNAME=your_bot_username_here
FRONTEND_URL=https://your-miniapp-domain.com

# ========================================
# PYTHON MCP СЕРВЕР (Общие Telegram функции)
# ========================================
# Получите эти данные на https://my.telegram.org/apps
TELEGRAM_API_ID=your_api_id_here
TELEGRAM_API_HASH=your_api_hash_here

# Сессия Telegram (выберите один из вариантов):
# Вариант 1: Строка сессии (рекомендуется для production)
TELEGRAM_SESSION_STRING=your_session_string_here

# Вариант 2: Имя файла сессии (для разработки)
TELEGRAM_SESSION_NAME=telegram_session

# ========================================
# ОБЩИЕ НАСТРОЙКИ
# ========================================
NODE_ENV=development
LOG_LEVEL=info
EOF
    echo "✅ .env файл создан. Пожалуйста, отредактируйте его и добавьте ваши данные."
else
    echo "✅ .env файл уже существует"
fi

# Установка зависимостей Node.js MCP сервера
echo "📦 Установка зависимостей Node.js MCP сервера..."
if [ -f mcp-package.json ]; then
    npm install --prefix ./
else
    echo "❌ mcp-package.json не найден"
    exit 1
fi

# Проверка установки Node.js зависимостей
if [ ! -d "node_modules" ]; then
    echo "❌ Node.js зависимости не установлены. Попробуйте запустить 'npm install' вручную."
    exit 1
fi

echo "✅ Node.js зависимости установлены"

# Установка зависимостей Python MCP сервера
echo "🐍 Установка зависимостей Python MCP сервера..."
cd python-mcp

# Проверка наличия pip
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 не найден. Попробуйте установить Python с pip или используйте альтернативные методы."
    exit 1
fi

# Установка зависимостей
echo "📦 Установка Python зависимостей..."
pip3 install -r requirements.txt

# Проверка установки
if ! python3 -c "import telethon, mcp" 2>/dev/null; then
    echo "❌ Python зависимости не установлены корректно. Попробуйте установить вручную."
    exit 1
fi

echo "✅ Python зависимости установлены"
cd ..

# Создание скриптов запуска
echo "🔧 Создание скриптов запуска для интегрированной системы..."

# Скрипт запуска Node.js MCP сервера
cat > start-node-mcp.sh << 'EOF'
#!/bin/bash
echo "🚀 Запуск Node.js MCP сервера для Telegram Mini App..."
export $(cat .env | xargs)
node mcp-server.js
EOF

# Скрипт запуска Python MCP сервера
cat > start-python-mcp.sh << 'EOF'
#!/bin/bash
echo "🐍 Запуск Python MCP сервера для общих Telegram функций..."
export $(cat .env | xargs)
cd python-mcp
python3 main.py
EOF

# Скрипт запуска обоих серверов
cat > start-both-mcp.sh << 'EOF'
#!/bin/bash
echo "🚀🐍 Запуск интегрированной MCP системы..."
echo "Node.js MCP (Mini App) + Python MCP (общие функции)"

# Запуск Node.js MCP в фоне
echo "🚀 Запуск Node.js MCP сервера..."
export $(cat .env | xargs)
nohup node mcp-server.js > node-mcp.log 2>&1 &
NODE_PID=$!
echo "Node.js MCP запущен с PID: $NODE_PID"

# Запуск Python MCP в фоне
echo "🐍 Запуск Python MCP сервера..."
cd python-mcp
nohup python3 main.py > python-mcp.log 2>&1 &
PYTHON_PID=$!
echo "Python MCP запущен с PID: $PYTHON_PID"

echo ""
echo "🎉 Оба MCP сервера запущены!"
echo "Node.js MCP PID: $NODE_PID (логи: node-mcp.log)"
echo "Python MCP PID: $PYTHON_PID (логи: python-mcp.log)"
echo ""
echo "Для остановки используйте:"
echo "kill $NODE_PID $PYTHON_PID"
echo ""
echo "Для просмотра логов:"
echo "tail -f node-mcp.log python-mcp.log"
EOF

# Скрипт для режима разработки
cat > dev-integrated-mcp.sh << 'EOF'
#!/bin/bash
echo "🔧 Запуск интегрированной MCP системы в режиме разработки..."
echo "Node.js MCP (с автоперезагрузкой) + Python MCP"

# Запуск Node.js MCP в режиме разработки
echo "🚀 Запуск Node.js MCP в режиме разработки..."
export $(cat .env | xargs)
nohup node --watch mcp-server.js > node-mcp-dev.log 2>&1 &
NODE_PID=$!

# Запуск Python MCP
echo "🐍 Запуск Python MCP сервера..."
cd python-mcp
nohup python3 main.py > python-mcp-dev.log 2>&1 &
PYTHON_PID=$!

echo ""
echo "🎉 Оба MCP сервера запущены в режиме разработки!"
echo "Node.js MCP PID: $NODE_PID (логи: node-mcp-dev.log)"
echo "Python MCP PID: $PYTHON_PID (логи: python-mcp-dev.log)"
echo ""
echo "Для остановки используйте:"
echo "kill $NODE_PID $PYTHON_PID"
EOF

# Скрипт тестирования
cat > test-integrated-mcp.sh << 'EOF'
#!/bin/bash
echo "🧪 Тестирование интегрированной MCP системы..."

echo "1. Тестирование Node.js MCP..."
export $(cat .env | xargs)
node mcp-examples.js

echo ""
echo "2. Тестирование Python MCP..."
cd python-mcp
python3 -c "
import asyncio
import main
print('Python MCP сервер готов к работе!')
print('Доступные инструменты:')
for tool in main.mcp.tools:
    print(f'  - {tool.name}: {tool.description}')
"
cd ..

echo ""
echo "✅ Тестирование завершено!"
EOF

# Скрипт остановки
cat > stop-mcp.sh << 'EOF'
#!/bin/bash
echo "🛑 Остановка всех MCP серверов..."

# Поиск и остановка Node.js MCP процессов
NODE_PIDS=$(pgrep -f "node.*mcp-server.js" || true)
if [ ! -z "$NODE_PIDS" ]; then
    echo "Остановка Node.js MCP процессов: $NODE_PIDS"
    kill $NODE_PIDS
else
    echo "Node.js MCP процессы не найдены"
fi

# Поиск и остановка Python MCP процессов
PYTHON_PIDS=$(pgrep -f "python.*main.py" || true)
if [ ! -z "$PYTHON_PIDS" ]; then
    echo "Остановка Python MCP процессов: $PYTHON_PIDS"
    kill $PYTHON_PIDS
else
    echo "Python MCP процессы не найдены"
fi

echo "✅ Все MCP серверы остановлены"
EOF

# Скрипт проверки статуса
cat > status-mcp.sh << 'EOF'
#!/bin/bash
echo "📊 Статус интегрированной MCP системы..."

echo "Node.js MCP сервер:"
NODE_PIDS=$(pgrep -f "node.*mcp-server.js" || true)
if [ ! -z "$NODE_PIDS" ]; then
    echo "  ✅ Запущен (PID: $NODE_PIDS)"
else
    echo "  ❌ Не запущен"
fi

echo ""
echo "Python MCP сервер:"
PYTHON_PIDS=$(pgrep -f "python.*main.py" || true)
if [ ! -z "$PYTHON_PIDS" ]; then
    echo "  ✅ Запущен (PID: $PYTHON_PIDS)"
else
    echo "  ❌ Не запущен"
fi

echo ""
echo "Логи:"
echo "  Node.js MCP: node-mcp.log (если запущен)"
echo "  Python MCP: python-mcp.log (если запущен)"
echo "  Режим разработки: node-mcp-dev.log, python-mcp-dev.log"
EOF

# Делаем скрипты исполняемыми
chmod +x start-node-mcp.sh start-python-mcp.sh start-both-mcp.sh dev-integrated-mcp.sh test-integrated-mcp.sh stop-mcp.sh status-mcp.sh

echo "✅ Скрипты запуска созданы"

# Проверка конфигурации
echo "🔍 Проверка конфигурации..."

# Проверка Node.js переменных
if grep -q "your_bot_token_here" .env; then
    echo "⚠️  ВНИМАНИЕ: TELEGRAM_BOT_TOKEN не настроен в .env файле"
    echo "   Пожалуйста, отредактируйте .env файл и добавьте ваш токен бота"
fi

if grep -q "your_bot_username_here" .env; then
    echo "⚠️  ВНИМАНИЕ: TELEGRAM_BOT_USERNAME не настроен в .env файле"
    echo "   Пожалуйста, отредактируйте .env файл и добавьте username вашего бота"
fi

# Проверка Python переменных
if grep -q "your_api_id_here" .env; then
    echo "⚠️  ВНИМАНИЕ: TELEGRAM_API_ID не настроен в .env файле"
    echo "   Получите на https://my.telegram.org/apps"
fi

if grep -q "your_api_hash_here" .env; then
    echo "⚠️  ВНИМАНИЕ: TELEGRAM_API_HASH не настроен в .env файле"
    echo "   Получите на https://my.telegram.org/apps"
fi

# Создание инструкции по настройке
echo "📚 Создание инструкции по настройке интегрированной системы..."
cat > SETUP_INTEGRATED_INSTRUCTIONS.md << 'EOF'
# Инструкция по настройке интегрированной MCP системы

## 🚀 Быстрый старт

### 1. Настройка переменных окружения в файле `.env`:

#### Node.js MCP (Mini App + Helpdesk):
- `TELEGRAM_BOT_TOKEN` - токен вашего Telegram бота
- `TELEGRAM_BOT_USERNAME` - username вашего бота
- `FRONTEND_URL` - URL вашего Mini App

#### Python MCP (Общие Telegram функции):
- `TELEGRAM_API_ID` - API ID с https://my.telegram.org/apps
- `TELEGRAM_API_HASH` - API Hash с https://my.telegram.org/apps
- `TELEGRAM_SESSION_STRING` - строка сессии (рекомендуется)
- `TELEGRAM_SESSION_NAME` - имя файла сессии (альтернатива)

### 2. Запуск системы:

#### Запуск обоих серверов:
```bash
./start-both-mcp.sh
```

#### Запуск по отдельности:
```bash
./start-node-mcp.sh    # Node.js MCP
./start-python-mcp.sh  # Python MCP
```

#### Режим разработки:
```bash
./dev-integrated-mcp.sh
```

### 3. Тестирование:
```bash
./test-integrated-mcp.sh
```

### 4. Управление:
```bash
./status-mcp.sh    # Проверка статуса
./stop-mcp.sh      # Остановка всех серверов
```

## 🔧 Настройка MCP клиента

### Для Cursor/VS Code:
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
    },
    "telegram-python": {
      "command": "python",
      "args": ["/path/to/your/project/python-mcp/main.py"],
      "env": {
        "TELEGRAM_API_ID": "your_api_id",
        "TELEGRAM_API_HASH": "your_api_hash",
        "TELEGRAM_SESSION_STRING": "your_session_string"
      }
    }
  }
}
```

## 📱 Доступные инструменты

### Node.js MCP (12 инструментов):
- send_telegram_message
- send_ticket_notification
- create_inline_keyboard
- get_chat_info
- set_webhook
- и другие...

### Python MCP (20+ инструментов):
- send_message
- get_chats
- create_group
- add_contact
- download_media
- и другие...

## 📞 Поддержка

- Документация: MCP_README.md
- Примеры: mcp-examples.js
- Проблемы: создайте Issue в репозитории
EOF

echo "✅ Инструкция по настройке создана"

# Финальная информация
echo ""
echo "🎉 Установка интегрированной MCP системы завершена!"
echo ""
echo "📋 Следующие шаги:"
echo "1. Отредактируйте .env файл и добавьте ваши данные"
echo "2. Получите Telegram API данные на https://my.telegram.org/apps"
echo "3. Запустите систему: ./start-both-mcp.sh"
echo "4. Протестируйте: ./test-integrated-mcp.sh"
echo "5. Настройте MCP клиент согласно SETUP_INTEGRATED_INSTRUCTIONS.md"
echo ""
echo "📚 Документация:"
echo "- Основная: MCP_README.md"
echo "- Интегрированная: SETUP_INTEGRATED_INSTRUCTIONS.md"
echo "- Примеры: mcp-examples.js"
echo ""
echo "🔧 Доступные скрипты:"
echo "- start-both-mcp.sh     # Запуск обоих серверов"
echo "- start-node-mcp.sh     # Только Node.js MCP"
echo "- start-python-mcp.sh   # Только Python MCP"
echo "- dev-integrated-mcp.sh # Режим разработки"
echo "- test-integrated-mcp.sh # Тестирование"
echo "- status-mcp.sh         # Проверка статуса"
echo "- stop-mcp.sh           # Остановка всех серверов"
echo ""

# Проверка готовности к запуску
if ! grep -q "your_bot_token_here\|your_api_id_here" .env; then
    echo "✅ Система готова к запуску!"
else
    echo "⚠️  Система требует настройки переменных окружения"
fi

echo ""
echo "🚀🐍 Счастливого кодирования с интегрированной MCP системой!"
echo "Node.js MCP (Mini App) + Python MCP (общие функции) = 🎯"
