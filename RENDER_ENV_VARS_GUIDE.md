# 📝 Как добавить переменные окружения в Render.com

## 🎯 Пошаговая инструкция для пункта 3

После того как вы выбрали Blueprint и нажали "Apply", Render создаст несколько сервисов. Вам нужно добавить переменные окружения для каждого сервиса.

### Шаг 1: Найдите ваши сервисы

После применения Blueprint вы увидите список сервисов:
- `helpdesk-park-postgres` (База данных - настройки не нужны)
- `helpdesk-park-redis` (Redis - настройки не нужны) 
- `helpdesk-park-api` (Backend - НУЖНЫ переменные)
- `helpdesk-park-frontend` (Frontend - НУЖНЫ переменные)
- `chat-api` (Chat API - НУЖНЫ переменные)

### Шаг 2: Настройка Backend (helpdesk-park-api)

1. **Кликните на "helpdesk-park-api"** в списке сервисов
2. **Перейдите на вкладку "Environment"** (слева в меню)
3. **Нажмите "Add Environment Variable"**
4. **Добавьте каждую переменную по очереди:**

#### Переменная 1:
- **Key:** `TELEGRAM_BOT_TOKEN`
- **Value:** `ваш-токен-от-botfather` (замените на реальный токен)

#### Переменная 2:
- **Key:** `JWT_SECRET`
- **Value:** `119053072a8cf3234fb38f08c442a1a5b657ff061034d77ab84a2b8329f40e18d517d91c93eb049438f055d97886bfe1cf9f1c62aa4750b4c9b231f3525ad749`

#### Переменная 3:
- **Key:** `NODE_ENV`
- **Value:** `production`

5. **Нажмите "Save Changes"** после добавления всех переменных

### Шаг 3: Настройка Frontend (helpdesk-park-frontend)

1. **Кликните на "helpdesk-park-frontend"** в списке сервисов
2. **Перейдите на вкладку "Environment"**
3. **Нажмите "Add Environment Variable"**
4. **Добавьте переменную:**

#### Переменная 1:
- **Key:** `VITE_API_URL`
- **Value:** `https://helpdesk-park-api.onrender.com`

5. **Нажмите "Save Changes"**

### Шаг 4: Настройка Chat API (chat-api)

1. **Кликните на "chat-api"** в списке сервисов
2. **Перейдите на вкладку "Environment"**
3. **Нажмите "Add Environment Variable"**
4. **Добавьте переменную:**

#### Переменная 1:
- **Key:** `TELEGRAM_BOT_TOKEN`
- **Value:** `ваш-токен-от-botfather` (тот же что и для Backend)

5. **Нажмите "Save Changes"**

## 🔍 Где найти вкладку Environment?

После клика на название сервиса вы увидите боковое меню:
```
📊 Overview
⚙️  Settings
🌍 Environment  ← ВОТ ЭТА ВКЛАДКА
📝 Logs
🔄 Deploy
```

## ⚠️ Важные моменты:

1. **TELEGRAM_BOT_TOKEN** - должен быть одинаковый для `helpdesk-park-api` и `chat-api`
2. **JWT_SECRET** - используйте точно тот что я сгенерировал
3. **VITE_API_URL** - должен точно соответствовать URL backend сервиса
4. **Сохраняйте изменения** после добавления каждой группы переменных

## 🚨 Если не знаете TELEGRAM_BOT_TOKEN:

1. Откройте @BotFather в Telegram
2. Отправьте команду `/mybots`
3. Выберите вашего бота
4. Нажмите "API Token" 
5. Скопируйте токен (выглядит как `123456789:ABCdefGHIjklMNOpqrSTUvwxyz`)

## ✅ После добавления всех переменных:

Render автоматически перезапустит сервисы с новыми переменными. Это займет несколько минут.

---

**🎉 Готово! Переходите к следующему шагу деплоя.**
