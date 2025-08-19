# 🎨 Helpdesk Park Frontend

Современный React frontend для системы управления заявками парка аттракционов с Apple-style дизайном.

## ✨ Особенности

- **Apple Design System** - современный минималистичный дизайн
- **Telegram Mini App** - полная интеграция с Telegram WebApp API
- **Responsive Design** - адаптивный дизайн для всех устройств
- **TypeScript** - типизированный код для надежности
- **Tailwind CSS** - утилитарный CSS фреймворк
- **Zustand** - легковесное управление состоянием

## 🚀 Быстрый старт

### Установка зависимостей
```bash
npm install
```

### Запуск в режиме разработки
```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:5173

### Сборка для продакшена
```bash
npm run build
```

### Предварительный просмотр сборки
```bash
npm run preview
```

## 🏗️ Архитектура

### Структура проекта
```
src/
├── components/          # Переиспользуемые компоненты
│   ├── Layout.tsx      # Основной макет приложения
│   ├── StatusBadge.tsx # Бейдж статуса заявки
│   ├── PriorityBadge.tsx # Бейдж приоритета заявки
│   └── TicketCard.tsx  # Карточка заявки
├── pages/              # Страницы приложения
│   ├── LoginPage.tsx   # Страница входа
│   └── TicketsPage.tsx # Список заявок
├── hooks/              # React хуки
│   └── useTelegram.ts  # Хук для Telegram WebApp
├── stores/             # Zustand stores
│   └── authStore.ts    # Store аутентификации
├── types/              # TypeScript типы
│   ├── index.ts        # Основные типы
│   └── telegram.ts     # Telegram типы
├── App.tsx             # Основной компонент
├── main.tsx            # Точка входа
└── index.css           # Глобальные стили
```

### Ключевые компоненты

#### Layout.tsx
Основной макет приложения с навигацией и header'ом.

#### TicketCard.tsx
Карточка заявки с прогресс-баром и мета-информацией.

#### useTelegram.ts
Хук для интеграции с Telegram WebApp API.

#### authStore.ts
Zustand store для управления аутентификацией.

## 🎨 Дизайн система

### Apple System Colors
- **Primary**: #007AFF (System Blue)
- **Success**: #34C759 (System Green)
- **Warning**: #FF9500 (System Orange)
- **Error**: #FF3B30 (System Red)

### Typography
- **Large Title**: 34px, Bold
- **Title 1**: 28px, Semibold
- **Title 2**: 22px, Semibold
- **Headline**: 17px, Semibold
- **Body**: 17px, Regular
- **Callout**: 16px, Regular
- **Subheadline**: 15px, Regular
- **Footnote**: 13px, Regular
- **Caption**: 12px, Regular

### Components
- **apple-card**: Карточки с тенями и скругленными углами
- **apple-button-primary**: Основные кнопки
- **apple-button-secondary**: Вторичные кнопки
- **apple-input**: Поля ввода
- **apple-transition**: Плавные переходы

## 📱 Telegram Mini App

### Интеграция
- Автоматическое определение Telegram WebApp
- Настройка цветов в зависимости от темы
- Haptic feedback для мобильных устройств
- Адаптация под платформу

### Мета-теги
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="theme-color" content="#007AFF" />
```

## 🔧 Разработка

### Добавление новых компонентов
1. Создайте файл в `src/components/`
2. Используйте Apple-style классы из `index.css`
3. Добавьте TypeScript типы
4. Экспортируйте компонент

### Добавление новых страниц
1. Создайте файл в `src/pages/`
2. Добавьте роут в `App.tsx`
3. Используйте `ProtectedRoute` для защищенных страниц

### Управление состоянием
- Используйте Zustand stores для глобального состояния
- Локальное состояние в компонентах через `useState`
- Эффекты через `useEffect`

## 📦 Зависимости

### Основные
- **React 18** - UI библиотека
- **React Router 6** - маршрутизация
- **TypeScript** - типизация
- **Tailwind CSS** - стилизация

### Состояние и утилиты
- **Zustand** - управление состоянием
- **clsx** - условные классы
- **tailwind-merge** - слияние Tailwind классов

### Telegram
- **Telegram WebApp API** - интеграция с Telegram

## 🚀 Деплой

### Vercel (рекомендуется)
1. Подключите GitHub репозиторий
2. Настройте переменные окружения
3. Деплой автоматический при push

### GitHub Pages
1. Настройте GitHub Actions
2. Укажите `base` в `vite.config.ts`
3. Деплой в `gh-pages` ветку

## 🔍 Отладка

### Локальная разработка
```bash
npm run dev
```

### Проверка типов
```bash
npm run lint
```

### Сборка
```bash
npm run build
```

## 📚 Документация

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Telegram WebApp API](https://core.telegram.org/bots/webapps)

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature ветку
3. Внесите изменения
4. Создайте Pull Request

## 📄 Лицензия

MIT License - см. файл LICENSE для деталей.
