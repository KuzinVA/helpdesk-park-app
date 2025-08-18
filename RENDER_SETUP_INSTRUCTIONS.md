# 🚀 Подробная инструкция по деплою на Render.com

## 📋 Что вам понадобится

1. **Аккаунт на Render.com** - зарегистрируйтесь если его нет
2. **TELEGRAM_BOT_TOKEN** - токен вашего бота от @BotFather
3. **JWT_SECRET** - секретный ключ для JWT (можно сгенерировать любой)

## 🔧 Пошаговая инструкция

### Шаг 1: Подготовка переменных окружения
Подготовьте следующие переменные (вы будете вводить их в Render):

```
# Обязательные переменные:
TELEGRAM_BOT_TOKEN=ваш-токен-от-botfather
JWT_SECRET=any-random-secret-string-here-make-it-long-and-secure
NODE_ENV=production

# Эти URL будут автоматически сгенерированы Render:
FRONTEND_URL=https://helpdesk-park-frontend.onrender.com
API_URL=https://helpdesk-park-api.onrender.com

# База данных и Redis будут настроены автоматически через render.yaml
```

### Шаг 2: Заходим на Render.com

1. Откройте [render.com](https://render.com)
2. Войдите в аккаунт или зарегистрируйтесь
3. Подключите ваш GitHub аккаунт если еще не подключен

### Шаг 3: Создание Blueprint деплоя

1. **На главной странице Render Dashboard:**
   - Нажмите кнопку **"New +"** 
   - Выберите **"Blueprint"**

2. **Подключение репозитория:**
   - Выберите **"Connect a repository"**
   - Найдите и выберите репозиторий **"helpdesk-park-app"**
   - Нажмите **"Connect"**

3. **Выбор Blueprint файла:**
   - Render автоматически найдет файл `render.yaml`
   - Убедитесь что выбран правильный файл
   - Нажмите **"Apply"**

### Шаг 4: Настройка переменных окружения

После применения Blueprint, Render покажет список сервисов. Для каждого сервиса нужно добавить переменные:

#### Для сервиса "helpdesk-park-api" (Backend):
```
TELEGRAM_BOT_TOKEN=ваш-токен-бота
JWT_SECRET=ваш-секретный-ключ-jwt
NODE_ENV=production
```

#### Для сервиса "helpdesk-park-frontend" (Frontend):
```
VITE_API_URL=https://helpdesk-park-api.onrender.com
```

#### Для сервиса "chat-api":
```
TELEGRAM_BOT_TOKEN=ваш-токен-бота
```

**Как добавить переменные:**
1. Кликните на название сервиса
2. Перейдите в раздел **"Environment"**
3. Нажмите **"Add Environment Variable"**
4. Введите Name и Value для каждой переменной
5. Нажмите **"Save Changes"**

### Шаг 5: Запуск деплоя

1. После настройки всех переменных нажмите **"Apply"**
2. Render начнет процесс деплоя (это может занять 5-10 минут)
3. Следите за логами в разделе **"Events"**

### Шаг 6: Получение URL адресов

После успешного деплоя вы получите URL адреса:
- Frontend: `https://helpdesk-park-frontend.onrender.com`
- Backend API: `https://helpdesk-park-api.onrender.com`
- Chat API: `https://helpdesk-park-chat-api.onrender.com`

### Шаг 7: Обновление конфигурации бота

После получения URL адресов, обновите настройки Telegram бота:

1. Запустите скрипт обновления:
```bash
node setup-miniapp.js
```

2. Обновите webhook URL если используете:
```bash
# Обновите WEBHOOK_URL в вашем боте на:
# https://helpdesk-park-chat-api.onrender.com/webhook
```

## ✅ Проверка работы

1. **Проверьте API:** Откройте `https://helpdesk-park-api.onrender.com/health`
2. **Проверьте Frontend:** Откройте `https://helpdesk-park-frontend.onrender.com`
3. **Проверьте бота:** Отправьте `/start` в Telegram боте

## 🔧 Полезные советы

- **Первый запуск может быть медленным** (холодный старт)
- **Логи доступны** в разделе "Logs" каждого сервиса
- **Автоматические деплои** настроены при push в main ветку
- **Free tier** имеет лимиты, но достаточно для тестирования

## 🆘 Если что-то пошло не так

1. Проверьте логи в разделе "Logs"
2. Убедитесь что все переменные окружения заданы правильно
3. Проверьте что TELEGRAM_BOT_TOKEN валиден
4. Свяжитесь со мной если нужна помощь!

---

**🎉 После успешного деплоя ваш helpdesk будет доступен пользователям!**
