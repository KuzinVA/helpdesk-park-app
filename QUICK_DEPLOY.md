# 🚀 Быстрое развертывание на GitHub Pages

## 📋 Шаг 1: Создайте репозиторий на GitHub

1. Перейдите на [GitHub](https://github.com)
2. Нажмите "New repository"
3. Название: `helpdesk-park-app`
4. Публичный репозиторий
5. НЕ инициализируйте с README

## 📋 Шаг 2: Настройте remote origin

```bash
# Замените YOUR_USERNAME на ваше имя пользователя GitHub
git remote add origin https://github.com/YOUR_USERNAME/helpdesk-park-app.git
```

## 📋 Шаг 3: Запустите скрипт развертывания

```bash
./deploy.sh
```

## 📋 Шаг 4: Настройте GitHub Pages

1. Перейдите в Settings репозитория
2. Прокрутите до "Pages"
3. Source: "Deploy from a branch"
4. Branch: `main`, Folder: `/ (root)`
5. Save

## 🌐 Ваш URL будет:

`https://YOUR_USERNAME.github.io/helpdesk-park-app/`

## 📱 Обновите бота:

После получения URL замените в файлах:
- `setup-miniapp.js`
- `simple-bot.js`

И запустите:
```bash
node setup-miniapp.js
```

---

**Готово! 🎉**
