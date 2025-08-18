# 🚀 Бесплатный деплой: Vercel + Railway + Supabase

## 📋 Что получим бесплатно:

- 🌐 **Frontend на Vercel** - полностью бесплатно
- 🚂 **Backend на Railway** - $5 кредитов/месяц (хватает на тестирование)
- 🗄️ **PostgreSQL на Supabase** - бесплатно до 500MB
- 🤖 **Telegram Bot API** - встроен в Backend

---

## 🗄️ Шаг 1: Настройка базы данных на Supabase

### 1.1 Создание проекта
1. Откройте [supabase.com](https://supabase.com)
2. Зарегистрируйтесь или войдите в аккаунт
3. Нажмите **"New project"**
4. Заполните:
   - **Name:** `helpdesk-park`
   - **Database Password:** создайте надежный пароль
   - **Region:** ближайший к вам
5. Нажмите **"Create new project"**

### 1.2 Получение строки подключения
1. В проекте перейдите в **Settings → Database**
2. Найдите раздел **"Connection string"**
3. Выберите **"URI"** и скопируйте строку
4. Замените `[YOUR-PASSWORD]` на ваш пароль
5. Сохраните эту строку - она понадобится для Railway

**Пример:** `postgresql://postgres:ваш-пароль@db.xxx.supabase.co:5432/postgres`

### 1.3 Настройка схемы базы данных
1. Перейдите в **SQL Editor**
2. Создайте новый запрос и выполните команды из `backend/prisma/schema.prisma`

---

## 🚂 Шаг 2: Деплой Backend на Railway

### 2.1 Создание проекта
1. Откройте [railway.app](https://railway.app)
2. Войдите через GitHub
3. Нажмите **"New Project"**
4. Выберите **"Deploy from GitHub repo"**
5. Выберите репозиторий `helpdesk-park-app`

### 2.2 Настройка переменных окружения
В разделе **Variables** добавьте:

```
NODE_ENV=production
DATABASE_URL=ваша-строка-подключения-от-supabase
JWT_SECRET=119053072a8cf3234fb38f08c442a1a5b657ff061034d77ab84a2b8329f40e18d517d91c93eb049438f055d97886bfe1cf9f1c62aa4750b4c9b231f3525ad749
TELEGRAM_BOT_TOKEN=ваш-токен-от-botfather
FRONTEND_URL=https://ваш-домен.vercel.app
```

### 2.3 Настройка билда
1. В **Settings → Build** укажите:
   - **Build Command:** `cd backend && npm ci && npm run build`
   - **Start Command:** `cd backend && npm run start:prod`
2. **Deploy** - Railway автоматически задеплоит проект

### 2.4 Получение URL
После деплоя скопируйте URL вашего API (например: `https://helpdesk-park-production.up.railway.app`)

---

## 🌐 Шаг 3: Деплой Frontend на Vercel

### 3.1 Создание проекта
1. Откройте [vercel.com](https://vercel.com)
2. Войдите через GitHub
3. Нажмите **"New Project"**
4. Выберите репозиторий `helpdesk-park-app`
5. Настройте проект:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### 3.2 Настройка переменных окружения
В **Settings → Environment Variables** добавьте:

```
VITE_API_URL=https://ваш-railway-url.up.railway.app/api
VITE_TELEGRAM_BOT_USERNAME=helpdeskParkApp_bot
```

### 3.3 Деплой
1. Нажмите **"Deploy"**
2. Дождитесь завершения сборки
3. Получите URL фронтенда (например: `https://helpdesk-park.vercel.app`)

---

## 🤖 Шаг 4: Обновление Telegram бота

### 4.1 Обновление URL в коде
Отредактируйте `setup-miniapp.js`:
```javascript
// Замените URL на ваш Vercel URL
web_app: {
    url: 'https://helpdesk-park.vercel.app'
}
```

### 4.2 Запуск обновления
```bash
node setup-miniapp.js
```

---

## ✅ Проверка работы

1. **API Health Check:** `https://ваш-railway-url.up.railway.app/api/health`
2. **Frontend:** `https://helpdesk-park.vercel.app`
3. **Telegram Bot:** Отправьте `/start` в боте

---

## 💰 Стоимость в месяц:

- **Vercel:** $0 (бесплатно)
- **Railway:** ~$0-5 (в зависимости от использования)
- **Supabase:** $0 (до 500MB данных)

**Итого:** ~$0-5/месяц 🎉

---

## 🔧 Полезные команды

### Обновление после изменений:
```bash
# После изменения frontend
git push origin main  # Vercel автоматически пересобрет

# После изменения backend  
git push origin main  # Railway автоматически передеплоит
```

### Проверка логов:
- **Railway:** В дашборде проекта → Deployments → Logs
- **Vercel:** В дашборде проекта → Functions → View Logs

---

**🎯 Готово! У вас полностью функциональное приложение почти бесплатно!**
