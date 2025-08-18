# Руководство по интеграции MCP с существующим проектом

Этот документ описывает, как интегрировать MCP (Model Context Protocol) сервер для Telegram Mini App с вашим существующим проектом.

## 🚀 Быстрый старт

### 1. Установка MCP сервера

```bash
# Клонирование проекта (если еще не сделано)
git clone <your-repo-url>
cd helpdesk-park-app

# Запуск автоматической установки
chmod +x setup-mcp.sh
./setup-mcp.sh
```

### 2. Настройка переменных окружения

Отредактируйте файл `.env`:

```env
TELEGRAM_BOT_TOKEN=your_actual_bot_token
TELEGRAM_BOT_USERNAME=your_actual_bot_username
FRONTEND_URL=https://your-actual-domain.com
```

### 3. Запуск MCP сервера

```bash
# Обычный запуск
./start-mcp.sh

# Для разработки (с автоперезагрузкой)
./dev-mcp.sh

# Тестирование
./test-mcp.sh
```

## 🔌 Интеграция с NestJS Backend

### 1. Добавление MCP модуля

В вашем `app.module.ts`:

```typescript
import { TelegramMCPModule } from './telegram/telegram-mcp.module';

@Module({
  imports: [
    // ... другие модули
    TelegramMCPModule,
  ],
  // ...
})
export class AppModule {}
```

### 2. Использование MCP сервиса

В любом из ваших сервисов:

```typescript
import { TelegramMCPService } from './telegram/telegram-mcp.service';

@Injectable()
export class YourService {
  constructor(
    private readonly telegramMCP: TelegramMCPService,
  ) {}

  async sendNotification(chatId: string, ticket: any) {
    // Отправка уведомления через MCP
    await this.telegramMCP.sendTicketNotification(
      chatId,
      ticket,
      'ASSIGNED'
    );
  }
}
```

### 3. Инициализация MCP клиента

В вашем `main.ts` или специальном сервисе:

```typescript
import { TelegramMCPService } from './telegram/telegram-mcp.service';

// Инициализация MCP клиента
const mcpClient = new MCPClient();
await mcpClient.connect();

// Передача клиента в сервис
telegramMCPService.setMCPClient(mcpClient);
```

## 🌐 Интеграция с Frontend

### 1. React Hook для MCP

Создайте `hooks/useTelegramMCP.ts`:

```typescript
import { useCallback } from 'react';

export const useTelegramMCP = () => {
  const sendMessage = useCallback(async (chatId: string, message: string) => {
    const response = await fetch('/api/telegram-mcp/send-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, message })
    });
    
    return response.json();
  }, []);

  const sendTicketNotification = useCallback(async (
    chatId: string, 
    ticket: any, 
    type: string
  ) => {
    const response = await fetch('/api/telegram-mcp/send-ticket-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, ticket, notification_type: type })
    });
    
    return response.json();
  }, []);

  return { sendMessage, sendTicketNotification };
};
```

### 2. Использование в компонентах

```typescript
import { useTelegramMCP } from '../hooks/useTelegramMCP';

export const TicketCard = ({ ticket }) => {
  const { sendTicketNotification } = useTelegramMCP();

  const handleNotify = async () => {
    try {
      await sendTicketNotification(
        '@support_team',
        ticket,
        'STATUS_CHANGED'
      );
      // Показать уведомление об успехе
    } catch (error) {
      // Обработка ошибки
    }
  };

  return (
    <div>
      {/* Ваш UI */}
      <button onClick={handleNotify}>
        Уведомить команду
      </button>
    </div>
  );
};
```

## 🔧 Настройка MCP клиента

### Для Cursor/VS Code

Создайте или отредактируйте настройки MCP:

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

## 🧪 Тестирование интеграции

### 1. Тест MCP сервера

```bash
# Запуск тестов
./test-mcp.sh

# Или вручную
node mcp-examples.js
```

### 2. Тест API endpoints

```bash
# Проверка статуса MCP
curl http://localhost:3000/api/telegram-mcp/status

# Тест отправки сообщения
curl -X POST http://localhost:3000/api/telegram-mcp/send-message \
  -H "Content-Type: application/json" \
  -d '{"chat_id": "@test_chat", "message": "Test message"}'

# Тест MCP функций
curl -X POST http://localhost:3000/api/telegram-mcp/test \
  -H "Content-Type: application/json" \
  -d '{"action": "send_test_message", "params": {"chat_id": "@test_chat"}}'
```

### 3. Тест в браузере

Откройте `http://localhost:3000/api/telegram-mcp/status` в браузере для проверки статуса.

## 🔄 Миграция с существующего Telegram сервиса

### 1. Постепенная замена

```typescript
// Старый код
await this.telegramService.sendMessage(chatId, message);

// Новый код с MCP
await this.telegramMCP.sendMessage(chatId, message);
```

### 2. Совместное использование

```typescript
@Injectable()
export class HybridTelegramService {
  constructor(
    private readonly telegramService: TelegramService, // Старый сервис
    private readonly telegramMCP: TelegramMCPService, // Новый MCP сервис
  ) {}

  async sendMessage(chatId: string, message: string) {
    try {
      // Сначала пробуем MCP
      if (this.telegramMCP.isMCPReady()) {
        return await this.telegramMCP.sendMessage(chatId, message);
      }
    } catch (error) {
      // Fallback к старому сервису
      console.warn('MCP failed, falling back to legacy service:', error);
    }
    
    // Используем старый сервис как fallback
    return await this.telegramService.sendMessage(chatId, message);
  }
}
```

## 📊 Мониторинг и логирование

### 1. Логи MCP сервера

```bash
# Просмотр логов
./dev-mcp.sh 2>&1 | grep "MCP\|Telegram"

# Отладка
DEBUG=* ./start-mcp.sh
```

### 2. Метрики в NestJS

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class MetricsService {
  private mcpMessageCounter = 0;
  private mcpErrorCounter = 0;

  incrementMCPMessage() {
    this.mcpMessageCounter++;
  }

  incrementMCPError() {
    this.mcpErrorCounter++;
  }

  getMCPMetrics() {
    return {
      messages_sent: this.mcpMessageCounter,
      errors: this.mcpErrorCounter,
      success_rate: this.mcpMessageCounter / (this.mcpMessageCounter + this.mcpErrorCounter)
    };
  }
}
```

## 🔒 Безопасность

### 1. Валидация входных данных

```typescript
import { IsString, IsEnum, IsObject } from 'class-validator';

export class SendMessageDto {
  @IsString()
  chat_id: string;

  @IsString()
  message: string;

  @IsEnum(['HTML', 'Markdown'])
  parse_mode?: 'HTML' | 'Markdown';

  @IsObject()
  keyboard?: any;
}
```

### 2. Rate limiting

```typescript
import { ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(ThrottlerGuard)
@Controller('api/telegram-mcp')
export class TelegramMCPController {
  // ... ваш код
}
```

### 3. Аутентификация и авторизация

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/telegram-mcp')
export class TelegramMCPController {
  // ... ваш код
}
```

## 🚀 Production развертывание

### 1. Docker контейнеризация

```dockerfile
# Dockerfile для MCP сервера
FROM node:18-alpine

WORKDIR /app

COPY mcp-package.json ./
RUN npm install

COPY mcp-server.js ./
COPY .env ./

EXPOSE 3000

CMD ["node", "mcp-server.js"]
```

### 2. Environment variables в production

```bash
# В production используйте реальные значения
TELEGRAM_BOT_TOKEN=your_production_bot_token
TELEGRAM_BOT_USERNAME=your_production_bot_username
FRONTEND_URL=https://your-production-domain.com
NODE_ENV=production
LOG_LEVEL=warn
```

### 3. Мониторинг и health checks

```typescript
@Get('health')
async healthCheck() {
  const mcpStatus = this.telegramMCPService.isMCPReady();
  
  return {
    status: mcpStatus ? 'healthy' : 'unhealthy',
    mcp_ready: mcpStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  };
}
```

## 🐛 Устранение неполадок

### Частые проблемы:

1. **"MCP client not initialized"**
   - Убедитесь, что MCP клиент инициализирован
   - Проверьте порядок инициализации в main.ts

2. **"Telegram API error"**
   - Проверьте токен бота
   - Убедитесь, что бот не заблокирован

3. **"Connection refused"**
   - Проверьте, что MCP сервер запущен
   - Проверьте конфигурацию MCP клиента

### Отладка:

```typescript
// Включение подробного логирования
this.logger.debug('MCP request details:', {
  tool: 'send_telegram_message',
  args: { chat_id: chatId, message }
});

// Проверка состояния MCP
console.log('MCP Status:', this.telegramMCPService.isMCPReady());
```

## 📚 Дополнительные ресурсы

- [MCP README](MCP_README.md) - Подробная документация MCP
- [Примеры использования](mcp-examples.js) - Практические примеры
- [Telegram Bot API](https://core.telegram.org/bots/api) - Официальная документация
- [NestJS Documentation](https://docs.nestjs.com/) - Документация NestJS

---

**Успешной интеграции MCP с вашим проектом! 🚀**
