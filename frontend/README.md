# 🚀 Helpdesk Park - Telegram Mini App

Система управления заявками парка аттракционов, интегрированная с Telegram WebApp API.

## ✨ Особенности

- 🔐 **Аутентификация через Telegram** - автоматический вход по данным пользователя
- 📱 **Полная интеграция с Telegram** - кнопки, темы, вибрация, уведомления
- 🎨 **Адаптивный дизайн** - поддержка светлой и темной темы
- 📊 **Управление заявками** - создание, просмотр, редактирование
- 📈 **Статистика** - аналитика и отчеты
- 👤 **Профиль пользователя** - настройки и информация

## 🛠 Технологии

- **Frontend**: React 18 + TypeScript + Vite
- **Стили**: Tailwind CSS
- **Состояние**: Zustand
- **Маршрутизация**: React Router
- **Иконки**: Lucide React
- **Сборка**: Vite

## 🚀 Быстрый старт

### Установка зависимостей

```bash
npm install
```

### Запуск в режиме разработки

```bash
npm run dev
```

Приложение будет доступно по адресу: `http://localhost:5173`

### Сборка для продакшена

```bash
npm run build
```

## 📱 Telegram WebApp API

### Основные возможности

- **Автоматическая инициализация** при загрузке приложения
- **Управление кнопками** - главная кнопка и кнопка назад
- **Поддержка тем** - автоматическое переключение между светлой и темной
- **Haptic feedback** - тактильная обратная связь
- **Уведомления** - алерты и подтверждения
- **Управление цветами** - настройка заголовка и фона

### Хуки

#### `useTelegram()`

Основной хук для работы с Telegram WebApp API:

```typescript
const { 
  isReady, 
  user, 
  theme,
  showMainButton, 
  hideMainButton,
  hapticFeedback,
  showAlert,
  showConfirm 
} = useTelegram();
```

#### `useTelegramButtons()`

Автоматическое управление кнопками в зависимости от страницы:

```typescript
const { 
  setMainButton, 
  setBackButton, 
  clearButtons 
} = useTelegramButtons();
```

### Компоненты

#### `TelegramUserInfo`

Отображение информации о пользователе Telegram:

```typescript
<TelegramUserInfo 
  user={telegramUser} 
  showDetails={true} 
  className="custom-class" 
/>
```

## 🎨 Темы и стили

### Поддержка тем

Приложение автоматически определяет и применяет тему Telegram:
- **Светлая тема** - стандартные цвета
- **Темная тема** - адаптированные цвета для темного режима

### Цветовая схема

- **Основной**: `#3B82F6` (blue-500)
- **Акцент**: `#1E40AF` (blue-700)
- **Успех**: `#10B981` (emerald-500)
- **Ошибка**: `#EF4444` (red-500)
- **Предупреждение**: `#F59E0B` (amber-500)

## 📱 Адаптивность

### Мобильная версия
- Нижняя навигация
- Мобильное меню (гамбургер)
- Оптимизированные размеры для сенсорных экранов

### Десктопная версия
- Боковая панель навигации
- Расширенный интерфейс
- Горячие клавиши

## 🔧 Конфигурация

### Переменные окружения

Создайте файл `.env.local`:

```env
VITE_API_URL=http://localhost:3000
VITE_TELEGRAM_BOT_TOKEN=your_bot_token
```

### Настройка TypeScript

Пути алиасов настроены в `tsconfig.json`:

```json
{
  "paths": {
    "@/*": ["src/*"],
    "@/components/*": ["src/components/*"],
    "@/pages/*": ["src/pages/*"],
    "@/hooks/*": ["src/hooks/*"],
    "@/stores/*": ["src/stores/*"],
    "@/types/*": ["src/types/*"]
  }
}
```

## 🧪 Тестирование

### Тестовая страница

Откройте `telegram-test.html` для тестирования Telegram WebApp API в браузере.

### Запуск тестов

```bash
npm test
```

### E2E тесты

```bash
npm run e2e
```

## 📁 Структура проекта

```
src/
├── components/          # React компоненты
│   ├── Layout.tsx      # Основной макет
│   ├── TelegramUserInfo.tsx # Информация о пользователе
│   └── ...
├── hooks/              # React хуки
│   ├── useTelegram.ts  # Telegram WebApp API
│   ├── useTelegramButtons.ts # Управление кнопками
│   └── ...
├── pages/              # Страницы приложения
│   ├── LoginPage.tsx   # Страница входа
│   ├── TicketsPage.tsx # Список заявок
│   └── ...
├── stores/             # Zustand сторы
│   ├── authStore.ts    # Аутентификация
│   ├── ticketStore.ts  # Заявки
│   └── ...
├── types/              # TypeScript типы
│   ├── telegram.ts     # Telegram API типы
│   ├── ticket.ts       # Типы заявок
│   └── ...
└── utils/              # Утилиты
```

## 🔌 API интеграция

### Аутентификация

```typescript
const { loginWithTelegram } = useAuth();

try {
  await loginWithTelegram();
  // Успешный вход
} catch (error) {
  // Обработка ошибки
}
```

### Работа с заявками

```typescript
const { tickets, createTicket, updateTicket } = useTicketStore();

// Создание заявки
await createTicket({
  title: 'Название заявки',
  description: 'Описание проблемы',
  priority: 'high'
});
```

## 🚀 Развертывание

### GitHub Pages

```bash
npm run build
# Загрузите содержимое папки dist в GitHub Pages
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 80
CMD ["npm", "run", "preview"]
```

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Внесите изменения
4. Создайте Pull Request

## 📄 Лицензия

MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 📞 Поддержка

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Email**: support@helpdesk-park.com

---

**Сделано с ❤️ для парка аттракционов**
