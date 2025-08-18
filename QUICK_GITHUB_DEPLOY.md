# ⚡ Быстрый деплой: GitHub Pages + Railway + Supabase

## 🎯 Всего 4 шага по 3-5 минут:

### 1️⃣ GitHub Pages (2 мин)
1. Ваш репозиторий → **Settings** → **Pages** → Source: **"GitHub Actions"**
2. **Settings** → **Secrets and variables** → **Actions** → **Variables**:
   ```
   VITE_API_URL: https://пока-любой-url.com/api
   VITE_TELEGRAM_BOT_USERNAME: helpdeskParkApp_bot
   ```

### 2️⃣ Supabase (3 мин)
1. [supabase.com](https://supabase.com) → **New project** → `helpdesk-park`
2. **Settings** → **Database** → скопировать **Connection string**
3. Заменить `[YOUR-PASSWORD]` на ваш пароль

### 3️⃣ Railway (3 мин)  
1. [railway.app](https://railway.app) → **New Project** → GitHub → `helpdesk-park-app`
2. **Variables** добавить:
   ```
   DATABASE_URL=строка-от-supabase
   TELEGRAM_BOT_TOKEN=токен-от-botfather  
   JWT_SECRET=119053072a8cf3234fb38f08c442a1a5b657ff061034d77ab84a2b8329f40e18d517d91c93eb049438f055d97886bfe1cf9f1c62aa4750b4c9b231f3525ad749
   NODE_ENV=production
   ```
3. Скопировать Railway URL

### 4️⃣ Финиш (2 мин)
1. Обновить `VITE_API_URL` в GitHub на реальный Railway URL
2. Push любого изменения для запуска деплоя
3. Обновить `setup-miniapp.js` с GitHub Pages URL
4. Запустить `node setup-miniapp.js`

## ✅ Результат:
- **App:** `https://username.github.io/helpdesk-park-app/`
- **API:** `https://railway-url.up.railway.app/api/health`
- **Cost:** $0-5/месяц

---

**Подробная инструкция:** `GITHUB_PAGES_DEPLOY.md`
