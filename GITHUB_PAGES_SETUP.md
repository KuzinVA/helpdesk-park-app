# 🚀 Настройка GitHub Pages для Helpdesk Mini App

## 📋 Что нужно сделать:

### 1. Создать GitHub репозиторий
```bash
# Создайте новый репозиторий на GitHub
# Название: helpdesk-park-app
# Публичный репозиторий
```

### 2. Загрузить код
```bash
git init
git add .
git commit -m "Initial commit: Helpdesk Park Mini App"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/helpdesk-park-app.git
git push -u origin main
```

### 3. Настроить GitHub Pages
- Перейдите в Settings → Pages
- Source: Deploy from a branch
- Branch: main
- Folder: / (root)
- Нажмите Save

### 4. Настроить Telegram Bot
После того как GitHub Pages будет доступен по адресу:
`https://YOUR_USERNAME.github.io/helpdesk-park-app/`

Настройте webhook для бота:
```bash
curl -X POST "https://api.telegram.org/bot8465643840:AAEWFjl1h-EY3150NgihSG2HAaVYLci14Rk/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://YOUR_USERNAME.github.io/helpdesk-park-app/"}'
```

### 5. Протестировать
1. Откройте @helpdeskParkApp_bot в Telegram
2. Отправьте /start
3. Нажмите кнопку "Открыть приложение"

## 🎯 Альтернатива - Vercel (еще проще):

### 1. Зайдите на vercel.com
### 2. Подключите GitHub репозиторий
### 3. Автоматический деплой
### 4. Получите URL вида: https://helpdesk-park-app.vercel.app

## 📱 Структура файлов для GitHub Pages:

```
helpdesk-park-app/
├── index.html (главная страница)
├── index-github.html (мини-апп)
├── README.md
└── .github/
    └── workflows/
        └── deploy.yml (автоматический деплой)
```

## 🔧 Автоматический деплой:

Создайте файл `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
```

## 🎉 Результат:

После настройки у вас будет:
- ✅ Рабочий мини-апп на GitHub Pages
- ✅ Настроенный Telegram бот
- ✅ Автоматический деплой при изменениях
- ✅ Бесплатный хостинг

## 🆘 Если что-то не работает:

1. Проверьте URL в GitHub Pages
2. Убедитесь, что webhook настроен правильно
3. Проверьте логи бота через getWebhookInfo
4. Убедитесь, что мини-апп открывается в браузере
