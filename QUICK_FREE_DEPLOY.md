# ⚡ Быстрый бесплатный деплой

## 🎯 3 простых шага:

### 1️⃣ База данных (5 минут)
1. [supabase.com](https://supabase.com) → New project → `helpdesk-park`
2. Settings → Database → скопировать **Connection string**
3. Заменить `[YOUR-PASSWORD]` на ваш пароль

### 2️⃣ Backend (3 минуты)
1. [railway.app](https://railway.app) → New Project → GitHub → `helpdesk-park-app`
2. Variables → добавить:
   ```
   DATABASE_URL=строка-от-supabase
   TELEGRAM_BOT_TOKEN=токен-от-botfather
   JWT_SECRET=119053072a8cf3234fb38f08c442a1a5b657ff061034d77ab84a2b8329f40e18d517d91c93eb049438f055d97886bfe1cf9f1c62aa4750b4c9b231f3525ad749
   ```
3. Скопировать URL Railway проекта

### 3️⃣ Frontend (2 минуты)
1. [vercel.com](https://vercel.com) → New Project → `helpdesk-park-app`
2. Root Directory: `frontend`
3. Environment Variables:
   ```
   VITE_API_URL=railway-url/api
   VITE_TELEGRAM_BOT_USERNAME=helpdeskParkApp_bot
   ```

### 🤖 Обновить бота (1 минута)
```bash
# Отредактировать setup-miniapp.js с Vercel URL
node setup-miniapp.js
```

## ✅ Готово!
- **API:** railway-url/api/health
- **App:** vercel-url
- **Cost:** ~$0-5/месяц

---

**Подробная инструкция:** `FREE_DEPLOYMENT_GUIDE.md`
