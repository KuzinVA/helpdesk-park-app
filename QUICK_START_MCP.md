# 🚀 Быстрый запуск MCP для Telegram Mini App

## ⚡ 5 минут до первого сообщения

### 1. Установка (1 минута)
```bash
chmod +x setup-mcp.sh
./setup-mcp.sh
```

### 2. Настройка (2 минуты)
Отредактируйте `.env` файл:
```env
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_BOT_USERNAME=your_bot_name
FRONTEND_URL=https://your-app.com
```

### 3. Запуск (1 минута)
```bash
./start-mcp.sh
```

### 4. Тест (1 минута)
```bash
./test-mcp.sh
```

## 🎯 Что вы получите

✅ **MCP сервер** с 12 инструментами для Telegram  
✅ **REST API** для интеграции с вашим приложением  
✅ **Готовые примеры** использования  
✅ **Автоматические скрипты** запуска и тестирования  

## 🔧 Основные команды

```bash
# Запуск
./start-mcp.sh          # Обычный режим
./dev-mcp.sh            # Режим разработки
./test-mcp.sh           # Тестирование

# Проверка статуса
curl http://localhost:3000/api/telegram-mcp/status

# Отправка тестового сообщения
curl -X POST http://localhost:3000/api/telegram-mcp/send-message \
  -H "Content-Type: application/json" \
  -d '{"chat_id": "@your_chat", "message": "Hello MCP!"}'
```

## 📱 Доступные MCP инструменты

| Инструмент | Описание |
|------------|----------|
| `send_telegram_message` | Отправка сообщений |
| `send_ticket_notification` | Уведомления о заявках |
| `create_inline_keyboard` | Создание клавиатур |
| `get_chat_info` | Информация о чате |
| `set_webhook` | Установка webhook |
| `get_bot_info` | Информация о боте |

## 🔗 Интеграция с вашим проектом

### Backend (NestJS)
```typescript
import { TelegramMCPService } from './telegram/telegram-mcp.service';

@Injectable()
export class YourService {
  constructor(private telegramMCP: TelegramMCPService) {}
  
  async notify(chatId: string, ticket: any) {
    await this.telegramMCP.sendTicketNotification(
      chatId, ticket, 'ASSIGNED'
    );
  }
}
```

### Frontend (React)
```typescript
const { sendMessage } = useTelegramMCP();

await sendMessage('@support_team', 'Новая заявка!');
```

## 🆘 Нужна помощь?

- 📖 [Полная документация](MCP_README.md)
- 🔧 [Руководство по интеграции](INTEGRATION_GUIDE.md)
- 💡 [Примеры использования](mcp-examples.js)
- 🐛 [Устранение неполадок](MCP_README.md#устранение-неполадок)

## 🎉 Готово!

Теперь у вас есть полнофункциональный MCP сервер для работы с Telegram Mini App! 

**Следующий шаг:** Интеграция с вашим существующим проектом согласно [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)
