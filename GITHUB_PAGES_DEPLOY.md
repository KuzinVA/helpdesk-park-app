# 🚀 GitHub Pages + Railway + Supabase деплой

## 🎯 Архитектура (полностью бесплатная для тестирования):

- 🌐 **Frontend:** GitHub Pages (бесплатно)
- 🚂 **Backend:** Railway ($5 кредитов/месяц)
- 🗄️ **Database:** Supabase (бесплатно до 500MB)

---

## 📋 Пошаговая инструкция

### 1️⃣ Настройка GitHub Pages (2 минуты)

#### 1.1 Включение GitHub Pages
1. Откройте ваш репозиторий на GitHub
2. Перейдите в **Settings** → **Pages**
3. В разделе **Source** выберите **"GitHub Actions"**
4. Сохраните настройки

#### 1.2 Настройка переменных окружения
1. В репозитории перейдите в **Settings** → **Secrets and variables** → **Actions**
2. Перейдите на вкладку **Variables**
3. Нажмите **"New repository variable"** и добавьте:

```
Name: VITE_API_URL
Value: https://ваш-railway-url.up.railway.app/api

Name: VITE_TELEGRAM_BOT_USERNAME  
Value: helpdeskParkApp_bot
```

### 2️⃣ Настройка базы данных Supabase (5 минут)

#### 2.1 Создание проекта
1. Откройте [supabase.com](https://supabase.com)
2. **Sign up** или **Sign in**
3. **New project** → заполните:
   - **Name:** `helpdesk-park`
   - **Database Password:** создайте надежный пароль (сохраните!)
   - **Region:** выберите ближайший
4. **Create new project**

#### 2.2 Получение строки подключения
1. **Settings** → **Database**
2. Найдите **"Connection string"** → **"URI"**
3. Скопируйте строку и замените `[YOUR-PASSWORD]` на ваш пароль
4. Сохраните эту строку для Railway

**Пример:** 
```
postgresql://postgres:ваш-пароль@db.xxx.supabase.co:5432/postgres
```

### 3️⃣ Настройка Backend на Railway (5 минут)

#### 3.1 Создание проекта
1. Откройте [railway.app](https://railway.app)
2. **Login with GitHub**
3. **New Project** → **Deploy from GitHub repo**
4. Выберите `helpdesk-park-app`

#### 3.2 Настройка переменных окружения
В разделе **Variables** добавьте:

```
NODE_ENV=production
DATABASE_URL=postgresql://postgres:ваш-пароль@db.xxx.supabase.co:5432/postgres
JWT_SECRET=119053072a8cf3234fb38f08c442a1a5b657ff061034d77ab84a2b8329f40e18d517d91c93eb049438f055d97886bfe1cf9f1c62aa4750b4c9b231f3525ad749
TELEGRAM_BOT_TOKEN=ваш-токен-от-botfather
```

#### 3.3 Получение Railway URL
После деплоя скопируйте ваш Railway URL (например: `https://helpdesk-park-production.up.railway.app`)

### 4️⃣ Обновление GitHub переменных

Вернитесь в GitHub → **Settings** → **Secrets and variables** → **Actions** → **Variables**

Обновите `VITE_API_URL`:
```
VITE_API_URL=https://ваш-реальный-railway-url.up.railway.app/api
```

### 5️⃣ Запуск деплоя

#### 5.1 Автоматический деплой
1. Сделайте любое изменение в коде (например, в README)
2. Выполните:
```bash
git add .
git commit -m "Trigger GitHub Pages deploy"
git push origin main
```

#### 5.2 Проверка деплоя
1. Перейдите в **Actions** в вашем репозитории
2. Найдите workflow **"Deploy to GitHub Pages"**
3. Дождитесь завершения (обычно 3-5 минут)

### 6️⃣ Обновление Telegram бота

#### 6.1 Редактирование setup-miniapp.js
Замените URL в файле `setup-miniapp.js`:
```javascript
web_app: {
    url: 'https://ваш-username.github.io/helpdesk-park-app/'
}
```

#### 6.2 Запуск обновления
```bash
node setup-miniapp.js
```

---

## ✅ Проверка работы

1. **Frontend:** `https://ваш-username.github.io/helpdesk-park-app/`
2. **API Health:** `https://ваш-railway-url.up.railway.app/api/health`
3. **Telegram Bot:** Отправьте `/start` боту

---

## 💰 Итоговая стоимость:

- **GitHub Pages:** $0 (бесплатно)
- **Railway:** $0-5/месяц (зависит от трафика)
- **Supabase:** $0 (до 500MB данных)

**Итого: $0-5/месяц** 🎉

---

## 🔧 Полезные команды

### Пересборка фронтенда:
```bash
git add .
git commit -m "Update frontend"
git push origin main
```

### Проверка логов Railway:
1. Railway Dashboard → ваш проект → **Deployments** → **View Logs**

### Проверка логов GitHub Actions:
1. GitHub репозиторий → **Actions** → выберите последний workflow

---

**🎯 Готово! Полностью функциональное приложение почти бесплатно!**
