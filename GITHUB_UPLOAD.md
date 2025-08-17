# 🚀 Загрузка на GitHub за 5 минут

## 📋 Пошаговая инструкция:

### 1. Создайте репозиторий на GitHub
- Зайдите на [github.com](https://github.com)
- Нажмите "New repository"
- Название: `helpdesk-park-app`
- Публичный репозиторий ✅
- НЕ создавайте README, .gitignore, license
- Нажмите "Create repository"

### 2. Загрузите код
```bash
# Добавьте все файлы
git add .

# Сделайте первый коммит
git commit -m "🎉 Initial commit: Helpdesk Park Mini App"

# Переименуйте ветку в main
git branch -M main

# Добавьте удаленный репозиторий (замените YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/helpdesk-park-app.git

# Загрузите код
git push -u origin main
```

### 3. Настройте GitHub Pages
- В репозитории перейдите в **Settings**
- Прокрутите вниз до **Pages**
- **Source**: выберите "Deploy from a branch"
- **Branch**: выберите "main"
- **Folder**: выберите "/ (root)"
- Нажмите **Save**

### 4. Получите URL
Через 2-3 минуты ваш мини-апп будет доступен по адресу:
```
https://YOUR_USERNAME.github.io/helpdesk-park-app/
```

### 5. Настройте Telegram Bot
```bash
# Замените YOUR_USERNAME на ваше имя пользователя
curl -X POST "https://api.telegram.org/bot8465643840:AAEWFjl1h-EY3150NgihSG2HAaVYLci14Rk/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://YOUR_USERNAME.github.io/helpdesk-park-app/"}'
```

### 6. Протестируйте
- Откройте @helpdeskParkApp_bot в Telegram
- Отправьте `/start`
- Нажмите кнопку "🚀 Открыть приложение"

## 🎉 Готово!

Теперь у вас есть:
- ✅ Рабочий мини-апп на GitHub Pages
- ✅ Настроенный Telegram бот
- ✅ Бесплатный хостинг
- ✅ Автоматический деплой

## 🆘 Если что-то не работает:

1. **Проверьте URL** - убедитесь, что Pages включены
2. **Проверьте webhook** - используйте команду выше
3. **Проверьте бота** - отправьте `/start`
4. **Проверьте мини-апп** - откройте в браузере

## 🔄 Обновления

При изменении кода:
```bash
git add .
git commit -m "Обновление"
git push
```

GitHub Pages автоматически обновит сайт через 2-3 минуты.
