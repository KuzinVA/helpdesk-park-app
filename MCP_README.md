# MCP (Model Context Protocol) для Telegram Mini App

Этот проект предоставляет MCP сервер для работы с Telegram Mini App и взаимодействия с чатами через Telegram Bot API.

## 🚀 Возможности

### Основные инструменты:
- **send_telegram_message** - Отправка сообщений в чаты
- **get_chat_info** - Получение информации о чате
- **get_chat_members** - Получение списка участников чата
- **set_webhook** - Установка webhook для бота
- **delete_webhook** - Удаление webhook
- **get_webhook_info** - Получение информации о webhook
- **send_ticket_notification** - Отправка уведомлений о заявках
- **create_inline_keyboard** - Создание inline клавиатур
- **get_bot_info** - Получение информации о боте

### Специализированные функции:
- Автоматическое форматирование уведомлений о заявках
- Поддержка HTML и Markdown разметки
- Интеграция с Mini App через web_app кнопки
- Управление SLA уведомлениями
- Создание интерактивных клавиатур

## 📋 Требования

- Node.js 18.0.0 или выше
- Telegram Bot Token
- Доступ к Telegram Bot API

## 🛠️ Установка

### 1. Клонирование и настройка

```bash
# Установка зависимостей
npm install

# Или если используете yarn
yarn install
```

### 2. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_BOT_USERNAME=your_bot_username
FRONTEND_URL=https://your-miniapp-domain.com
```

### 3. Получение Telegram Bot Token

1. Найдите @BotFather в Telegram
2. Отправьте команду `/newbot`
3. Следуйте инструкциям для создания бота
4. Скопируйте полученный токен

## 🚀 Запуск

### Запуск MCP сервера

```bash
# Обычный запуск
npm start

# Запуск в режиме разработки (с автоперезагрузкой)
npm run dev
```

### Проверка работы

```bash
# Запуск примеров
node mcp-examples.js
```

## 🔧 Конфигурация MCP клиента

### Для Cursor/VS Code

Создайте или отредактируйте файл конфигурации MCP:

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

### Для других MCP клиентов

Адаптируйте конфигурацию под ваш MCP клиент согласно его документации.

## 📚 Примеры использования

### 1. Отправка простого сообщения

```javascript
{
  "name": "send_telegram_message",
  "arguments": {
    "chat_id": "@helpdesk_chat",
    "message": "🔔 <b>Новое уведомление</b>\n\nСистема работает в штатном режиме.",
    "parse_mode": "HTML"
  }
}
```

### 2. Создание inline клавиатуры

```javascript
{
  "name": "create_inline_keyboard",
  "arguments": {
    "buttons": [
      {
        "text": "📊 Статистика",
        "callback_data": "show_stats"
      },
      {
        "text": "📝 Создать заявку",
        "web_app": {
          "url": "https://your-app.com/create-ticket"
        }
      }
    ],
    "rows": 2
  }
}
```

### 3. Отправка уведомления о заявке

```javascript
{
  "name": "send_ticket_notification",
  "arguments": {
    "chat_id": "@support_team",
    "ticket": {
      "id": "ticket_123456",
      "title": "Проблема с доступом к системе",
      "status": "ASSIGNED",
      "priority": "HIGH",
      "service": { "name": "IT Support" },
      "location": { "name": "Главный офис" }
    },
    "notification_type": "ASSIGNED"
  }
}
```

## 🔌 Интеграция с существующим проектом

### Backend интеграция

Добавьте в ваш NestJS проект:

```typescript
// telegram-mcp.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class TelegramMCPService {
  async sendNotification(chatId: string, ticket: any, type: string) {
    // Использование MCP инструмента
    const result = await this.mcpClient.callTool('send_ticket_notification', {
      chat_id: chatId,
      ticket,
      notification_type: type
    });
    
    return result;
  }
}
```

### Frontend интеграция

В вашем React приложении:

```typescript
// hooks/useTelegramMCP.ts
import { useCallback } from 'react';

export const useTelegramMCP = () => {
  const sendMessage = useCallback(async (chatId: string, message: string) => {
    // Интеграция с MCP через ваш API
    const response = await fetch('/api/telegram/send-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, message })
    });
    
    return response.json();
  }, []);

  return { sendMessage };
};
```

## 🧪 Тестирование

### Тест отдельных функций

```bash
# Тест отправки сообщения
curl -X POST http://localhost:3000/api/telegram/send-message \
  -H "Content-Type: application/json" \
  -d '{"chat_id": "@test_chat", "message": "Test message"}'
```

### Тест webhook

```bash
# Тест установки webhook
curl -X POST http://localhost:3000/api/telegram/set-webhook \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-domain.com/webhook"}'
```

## 🔒 Безопасность

### Рекомендации:

1. **Никогда не публикуйте токен бота** в публичных репозиториях
2. **Используйте переменные окружения** для конфиденциальных данных
3. **Ограничьте доступ** к MCP серверу только доверенным клиентам
4. **Валидируйте входные данные** перед отправкой в Telegram API
5. **Логируйте все операции** для аудита

### Переменные окружения:

```bash
# Обязательные
TELEGRAM_BOT_TOKEN=your_secret_token
TELEGRAM_BOT_USERNAME=your_bot_username

# Опциональные
FRONTEND_URL=https://your-app.com
LOG_LEVEL=info
NODE_ENV=production
```

## 🐛 Устранение неполадок

### Частые проблемы:

1. **"Bot token invalid"**
   - Проверьте правильность токена
   - Убедитесь, что бот не заблокирован

2. **"Chat not found"**
   - Проверьте ID чата или username
   - Убедитесь, что бот добавлен в чат

3. **"Webhook failed"**
   - Проверьте доступность URL
   - Убедитесь в правильности SSL сертификата

4. **"MCP connection failed"**
   - Проверьте конфигурацию MCP клиента
   - Убедитесь, что сервер запущен

### Логи:

```bash
# Просмотр логов
npm run dev 2>&1 | grep "MCP\|Telegram"

# Отладка
DEBUG=* npm start
```

## 📈 Мониторинг и метрики

### Добавьте мониторинг:

```typescript
// metrics.service.ts
@Injectable()
export class MetricsService {
  private messageCounter = new Counter({
    name: 'telegram_messages_sent_total',
    help: 'Total number of Telegram messages sent'
  });

  incrementMessageCount() {
    this.messageCounter.inc();
  }
}
```

## 🔄 Обновления и версионирование

### Семантическое версионирование:

- **MAJOR** - Несовместимые изменения API
- **MINOR** - Новые функции, обратная совместимость
- **PATCH** - Исправления ошибок

### Миграции:

При обновлении проверяйте:
1. Совместимость версий Node.js
2. Изменения в Telegram Bot API
3. Обновления MCP SDK

## 🤝 Вклад в проект

### Как помочь:

1. **Сообщайте об ошибках** через Issues
2. **Предлагайте улучшения** через Pull Requests
3. **Делитесь примерами** использования
4. **Улучшайте документацию**

### Структура проекта:

```
├── mcp-server.js          # Основной MCP сервер
├── mcp-package.json       # Зависимости MCP сервера
├── mcp-config.json        # Конфигурация MCP клиента
├── mcp-examples.js        # Примеры использования
├── MCP_README.md          # Эта документация
└── .env.example           # Пример переменных окружения
```

## 📞 Поддержка

### Ресурсы:

- [Telegram Bot API Documentation](https://core.telegram.org/bots/api)
- [MCP Specification](https://modelcontextprotocol.io/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://react.dev/)

### Контакты:

- Создайте Issue в GitHub репозитории
- Обратитесь к команде разработки
- Проверьте FAQ в документации

## 📄 Лицензия

MIT License - см. файл LICENSE для деталей.

---

**Счастливого кодирования с MCP и Telegram Mini App! 🚀**
