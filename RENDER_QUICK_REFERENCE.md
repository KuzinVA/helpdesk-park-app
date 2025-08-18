# 🚀 Быстрая памятка для Render.com

## 📝 Ваши данные для деплоя:

### JWT Secret (сгенерирован):
```
119053072a8cf3234fb38f08c442a1a5b657ff061034d77ab84a2b8329f40e18d517d91c93eb049438f055d97886bfe1cf9f1c62aa4750b4c9b231f3525ad749
```

### Переменные окружения для Backend (helpdesk-park-api):
```
TELEGRAM_BOT_TOKEN=ваш-токен-от-botfather
JWT_SECRET=119053072a8cf3234fb38f08c442a1a5b657ff061034d77ab84a2b8329f40e18d517d91c93eb049438f055d97886bfe1cf9f1c62aa4750b4c9b231f3525ad749
NODE_ENV=production
```

### Переменные для Frontend (helpdesk-park-frontend):
```
VITE_API_URL=https://helpdesk-park-api.onrender.com
```

### Переменные для Chat API (chat-api):
```
TELEGRAM_BOT_TOKEN=ваш-токен-от-botfather
```

## 🔗 Ссылки:

1. **Render.com**: https://render.com
2. **Ваш репозиторий**: https://github.com/KuzinVA/helpdesk-park-app
3. **Blueprint файл**: render.yaml (уже в репозитории)

## ⚡ Быстрые действия:

1. Зайти на render.com → New + → Blueprint
2. Выбрать репозиторий helpdesk-park-app
3. Выбрать render.yaml файл
4. Добавить переменные окружения (см. выше)
5. Нажать Apply и ждать ~5-10 минут

## 📱 После деплоя:

Обновить бота:
```bash
node setup-miniapp.js
```

Готово! 🎉
