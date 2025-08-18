# 🚀🐍 Интегрированная MCP система для Telegram

## 🌟 Что это такое?

Это **мощная интегрированная система**, которая объединяет **два MCP сервера** для максимальной функциональности Telegram:

- **🚀 Node.js MCP** - Специализированные функции для Telegram Mini App и Helpdesk систем
- **🐍 Python MCP** - Универсальные функции для работы с Telegram (чаты, группы, контакты, медиа)

## 🎯 Преимущества интеграции

### ✅ **Лучшее из двух миров**
- **Node.js MCP**: Специализация на бизнес-логике, Mini App интеграции, уведомлениях
- **Python MCP**: Универсальные Telegram функции, управление чатами, работа с медиа

### ✅ **Гибкость и надежность**
- Автоматический выбор лучшего MCP для конкретной задачи
- Fallback механизм между серверами
- Возможность использования функций по отдельности или вместе

### ✅ **Масштабируемость**
- Модульная архитектура
- Легкое добавление новых функций
- Поддержка различных сценариев использования

## 🏗️ Архитектура системы

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   MCP Client    │◄──►│   Node.js MCP    │◄──►│ Telegram Bot   │
│  (Cursor/VS)    │    │  (Mini App)      │    │     API        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │   NestJS API     │
                       │  (REST + Hybrid) │
                       └──────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │  React Frontend  │
                       │   (Mini App)     │
                       └──────────────────┘

┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   MCP Client    │◄──►│   Python MCP     │◄──►│  Telethon API   │
│  (Cursor/VS)    │    │  (Общие функции) │    │   (User API)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📦 Доступные инструменты

### 🚀 **Node.js MCP (12 инструментов)**
| Инструмент | Описание | Использование |
|------------|----------|---------------|
| `send_telegram_message` | Отправка сообщений | Основная функция для отправки текста |
| `send_ticket_notification` | Уведомления о заявках | Автоматические уведомления с форматированием |
| `create_inline_keyboard` | Создание клавиатур | Интерактивные кнопки и меню |
| `get_chat_info` | Информация о чате | Получение метаданных чата |
| `set_webhook` | Установка webhook | Настройка получения обновлений |
| `get_bot_info` | Информация о боте | Данные о вашем боте |

### 🐍 **Python MCP (20+ инструментов)**
| Инструмент | Описание | Использование |
|------------|----------|---------------|
| `send_message` | Отправка сообщений | Универсальная отправка |
| `get_chats` | Список чатов | Получение всех чатов пользователя |
| `create_group` | Создание группы | Создание новых групп |
| `add_contact` | Добавление контакта | Управление контактами |
| `download_media` | Скачивание медиа | Загрузка файлов, фото, видео |
| `search_public_chats` | Поиск чатов | Поиск публичных каналов и групп |
| `join_chat_by_link` | Присоединение к чату | Присоединение по приглашению |
| `get_chat_members` | Участники чата | Список участников группы |

## 🚀 Быстрый старт

### 1. **Установка интегрированной системы**
```bash
# Клонирование Python MCP (если еще не сделано)
git clone https://github.com/chigwell/telegram-mcp.git python-mcp

# Запуск автоматической установки
chmod +x setup-integrated-mcp.sh
./setup-integrated-mcp.sh
```

### 2. **Настройка переменных окружения**
Отредактируйте `.env` файл:

```env
# ========================================
# NODE.JS MCP СЕРВЕР (Mini App + Helpdesk)
# ========================================
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_BOT_USERNAME=your_bot_username_here
FRONTEND_URL=https://your-miniapp-domain.com

# ========================================
# PYTHON MCP СЕРВЕР (Общие Telegram функции)
# ========================================
TELEGRAM_API_ID=your_api_id_here
TELEGRAM_API_HASH=your_api_hash_here
TELEGRAM_SESSION_STRING=your_session_string_here
```

### 3. **Запуск системы**
```bash
# Запуск обоих серверов
./start-both-mcp.sh

# Или по отдельности
./start-node-mcp.sh    # Только Node.js MCP
./start-python-mcp.sh  # Только Python MCP

# Режим разработки
./dev-integrated-mcp.sh
```

### 4. **Тестирование**
```bash
./test-integrated-mcp.sh
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

## 🔌 Интеграция с NestJS

### 1. **Добавление гибридного модуля**
```typescript
import { HybridTelegramModule } from './telegram/hybrid-telegram.module';

@Module({
  imports: [
    // ... другие модули
    HybridTelegramModule,
  ],
})
export class AppModule {}
```

### 2. **Использование гибридного сервиса**
```typescript
import { HybridTelegramService } from './telegram/hybrid-telegram.service';

@Injectable()
export class YourService {
  constructor(
    private readonly hybridTelegram: HybridTelegramService,
  ) {}

  async createSupportGroup() {
    // Создание группы через Python MCP + уведомление через Node.js MCP
    return await this.hybridTelegram.createSupportGroup(
      'Support Team',
      [123456789, 987654321],
      '👋 Добро пожаловать в группу поддержки!'
    );
  }

  async sendComplexNotification(chatId: string, ticket: any) {
    // Комплексное уведомление с использованием обоих MCP
    return await this.hybridTelegram.sendComplexNotification(
      chatId,
      ticket,
      'ASSIGNED',
      true // включая дополнительную информацию через Python MCP
    );
  }
}
```

## 🌐 Интеграция с Frontend

### React Hook для гибридной системы:
```typescript
import { useCallback } from 'react';

export const useHybridTelegramMCP = () => {
  const sendTicketNotification = useCallback(async (
    chatId: string, 
    ticket: any, 
    type: string
  ) => {
    const response = await fetch('/api/telegram-hybrid/send-ticket-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, ticket, notification_type: type })
    });
    
    return response.json();
  }, []);

  const createSupportGroup = useCallback(async (
    title: string,
    userIds: number[],
    message: string
  ) => {
    const response = await fetch('/api/telegram-hybrid/create-support-group', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, user_ids: userIds, initial_message: message })
    });
    
    return response.json();
  }, []);

  return { sendTicketNotification, createSupportGroup };
};
```

## 🎨 Примеры использования

### 1. **Создание группы поддержки с автоматическими уведомлениями**
```typescript
// 1. Создание группы через Python MCP
const group = await hybridTelegram.createSupportGroup(
  'IT Support Team',
  [111111111, 222222222, 333333333],
  '🚀 Добро пожаловать в команду IT поддержки!\n\nЗдесь вы можете:\n• Обсуждать технические вопросы\n• Получать уведомления о заявках\n• Координировать работу'
);

// Результат: группа создана + приветственное сообщение отправлено
```

### 2. **Комплексное уведомление с дополнительным контекстом**
```typescript
// Отправка уведомления через Node.js MCP + дополнительная информация через Python MCP
const notification = await hybridTelegram.sendComplexNotification(
  '@support_team',
  ticket,
  'ASSIGNED',
  true // включая дополнительную информацию
);

// Результат: красивое уведомление + дополнительный контекст о чате
```

### 3. **Автоматический выбор лучшего MCP**
```typescript
// Система автоматически выберет лучший MCP для задачи
await hybridTelegram.sendTicketNotification(chatId, ticket, 'ASSIGNED');     // Node.js MCP
await hybridTelegram.createGroup('New Project', [123, 456, 789]);           // Python MCP
await hybridTelegram.downloadMedia(messageId, chatId, '/downloads/');      // Python MCP
```

## 📊 Мониторинг и управление

### Доступные скрипты:
```bash
./start-both-mcp.sh      # Запуск обоих серверов
./start-node-mcp.sh      # Только Node.js MCP
./start-python-mcp.sh    # Только Python MCP
./dev-integrated-mcp.sh  # Режим разработки
./test-integrated-mcp.sh # Тестирование
./status-mcp.sh          # Проверка статуса
./stop-mcp.sh            # Остановка всех серверов
```

### Проверка статуса:
```bash
./status-mcp.sh

# Результат:
# Node.js MCP сервер:
#   ✅ Запущен (PID: 12345)
# 
# Python MCP сервер:
#   ✅ Запущен (PID: 12346)
```

### Просмотр логов:
```bash
# Логи production
tail -f node-mcp.log python-mcp.log

# Логи разработки
tail -f node-mcp-dev.log python-mcp-dev.log
```

## 🔒 Безопасность

### Переменные окружения:
- **Node.js MCP**: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_USERNAME`
- **Python MCP**: `TELEGRAM_API_ID`, `TELEGRAM_API_HASH`, `TELEGRAM_SESSION_STRING`

### Рекомендации:
1. **Никогда не публикуйте** токены и API ключи
2. **Используйте переменные окружения** для конфиденциальных данных
3. **Ограничьте доступ** к MCP серверам только доверенным клиентам
4. **Логируйте все операции** для аудита

## 🐛 Устранение неполадок

### Частые проблемы:

1. **"Python MCP client not initialized"**
   - Убедитесь, что Python MCP сервер запущен
   - Проверьте переменные окружения для Python MCP

2. **"Node.js MCP client not initialized"**
   - Убедитесь, что Node.js MCP сервер запущен
   - Проверьте переменные окружения для Node.js MCP

3. **"Telegram API error"**
   - Проверьте токен бота (Node.js MCP)
   - Проверьте API ID/Hash (Python MCP)
   - Убедитесь, что бот/пользователь не заблокирован

### Отладка:
```bash
# Подробные логи
DEBUG=* ./start-both-mcp.sh

# Проверка статуса
./status-mcp.sh

# Тестирование
./test-integrated-mcp.sh
```

## 📚 Дополнительные ресурсы

- [Основная документация](MCP_README.md)
- [Руководство по интеграции](INTEGRATION_GUIDE.md)
- [Примеры использования](mcp-examples.js)
- [Python MCP проект](https://github.com/chigwell/telegram-mcp)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Telethon Documentation](https://docs.telethon.dev/)

## 🚀 Roadmap

### Версия 1.1
- [ ] Автоматическая синхронизация между MCP серверами
- [ ] Единый интерфейс для всех функций
- [ ] Расширенная аналитика и метрики

### Версия 1.2
- [ ] WebSocket поддержка для real-time уведомлений
- [ ] Интеграция с другими мессенджерами
- [ ] Машинное обучение для оптимизации выбора MCP

### Версия 2.0
- [ ] Поддержка множественных Telegram аккаунтов
- [ ] Автоматические ответы и боты
- [ ] Интеграция с CRM системами

---

## 🎉 Заключение

Интегрированная MCP система предоставляет **мощный и гибкий способ** работы с Telegram, объединяя специализированные функции Mini App с универсальными возможностями управления Telegram.

**Начните с [QUICK_START_MCP.md](QUICK_START_MCP.md) для быстрого старта!**

---

*Создано командой Helpdesk Park Team* 🚀🐍
