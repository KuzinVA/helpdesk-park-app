# 📦 Установка зависимостей для MCP

## 🚀 Автоматическая установка

### Для Unix-систем (macOS, Linux)
```bash
chmod +x setup-mcp.sh
./setup-mcp.sh
```

### Для Windows
```bash
# В PowerShell или Command Prompt
bash setup-mcp.sh
```

## 🔧 Ручная установка

### 1. Установка Node.js
```bash
# Проверка версии (требуется 18+)
node --version

# Если не установлен, скачайте с https://nodejs.org/
# Или используйте nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

### 2. Установка зависимостей MCP
```bash
# Переход в корень проекта
cd helpdesk-park-app

# Установка зависимостей
npm install --prefix ./

# Проверка установки
ls node_modules/@modelcontextprotocol
```

### 3. Создание .env файла
```bash
# Создание файла .env
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
```

### 4. Создание скриптов запуска
```bash
# Скрипт запуска
cat > start-mcp.sh << 'EOF'
#!/bin/bash
echo "🚀 Запуск MCP сервера для Telegram Mini App..."
export $(cat .env | xargs)
node mcp-server.js
EOF

# Скрипт разработки
cat > dev-mcp.sh << 'EOF'
#!/bin/bash
echo "🔧 Запуск MCP сервера в режиме разработки..."
export $(cat .env | xargs)
node --watch mcp-server.js
EOF

# Скрипт тестирования
cat > test-mcp.sh << 'EOF'
#!/bin/bash
echo "🧪 Тестирование MCP инструментов..."
export $(cat .env | xargs)
node mcp-examples.js
EOF

# Делаем скрипты исполняемыми
chmod +x start-mcp.sh dev-mcp.sh test-mcp.sh
```

## 📋 Проверка установки

### 1. Проверка Node.js
```bash
node --version  # Должно быть v18.0.0 или выше
npm --version   # Должно быть 8.0.0 или выше
```

### 2. Проверка зависимостей
```bash
# Проверка MCP SDK
ls node_modules/@modelcontextprotocol/sdk

# Проверка других зависимостей
ls node_modules/node-fetch
```

### 3. Проверка файлов
```bash
# Основные файлы
ls -la mcp-server.js
ls -la mcp-package.json
ls -la .env

# Скрипты
ls -la start-mcp.sh
ls -la dev-mcp.sh
ls -la test-mcp.sh
```

## 🐛 Устранение проблем

### Проблема: "Cannot find module '@modelcontextprotocol/sdk'"
```bash
# Решение: переустановка зависимостей
rm -rf node_modules package-lock.json
npm install --prefix ./
```

### Проблема: "Permission denied" для скриптов
```bash
# Решение: изменение прав доступа
chmod +x *.sh
```

### Проблема: "Node.js version too old"
```bash
# Решение: обновление Node.js
# Используйте nvm или скачайте новую версию с nodejs.org
nvm install 18
nvm use 18
```

### Проблема: "Environment variables not found"
```bash
# Решение: проверка .env файла
cat .env
# Убедитесь, что файл существует и содержит нужные переменные
```

## 🔍 Детальная диагностика

### Проверка всех зависимостей
```bash
# Список установленных пакетов
npm list --depth=0

# Проверка версий
npm list @modelcontextprotocol/sdk
npm list node-fetch
```

### Проверка переменных окружения
```bash
# Загрузка переменных
source .env

# Проверка значений
echo "BOT_TOKEN: $TELEGRAM_BOT_TOKEN"
echo "BOT_USERNAME: $TELEGRAM_BOT_USERNAME"
echo "FRONTEND_URL: $FRONTEND_URL"
```

### Проверка сетевого доступа
```bash
# Тест доступа к Telegram API
curl -s "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getMe" | jq .

# Тест доступа к интернету
curl -s https://httpbin.org/ip
```

## 📚 Дополнительные ресурсы

- [Node.js Installation](https://nodejs.org/en/download/)
- [npm Documentation](https://docs.npmjs.com/)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)
- [Telegram Bot API](https://core.telegram.org/bots/api)

## ✅ Чек-лист установки

- [ ] Node.js 18+ установлен
- [ ] npm доступен
- [ ] Зависимости установлены
- [ ] .env файл создан и настроен
- [ ] Скрипты запуска созданы
- [ ] Права доступа настроены
- [ ] MCP сервер запускается
- [ ] Тесты проходят успешно

## 🚀 Следующий шаг

После успешной установки зависимостей переходите к [QUICK_START_MCP.md](QUICK_START_MCP.md) для быстрого старта!
