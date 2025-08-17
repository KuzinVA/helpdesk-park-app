# 🚀 Развертывание Chat API на Render.com

## 📋 **Что нужно сделать:**

### **1. Создать аккаунт на Render.com**
- Перейдите на [render.com](https://render.com)
- Зарегистрируйтесь через GitHub

### **2. Создать новый Web Service**
- Нажмите "New +" → "Web Service"
- Подключите ваш GitHub репозиторий: `KuzinVA/helpdesk-park-app`

### **3. Настройка сервиса:**
```
Name: helpdesk-chat-api
Environment: Node
Region: Frankfurt (EU Central)
Branch: main
Build Command: npm install
Start Command: node chat-api.js
```

### **4. Переменные окружения:**
```
BOT_TOKEN = 8465643840:AAEWFjl1h-EY3150NgihSG2HAaVYLci14Rk
NODE_ENV = production
PORT = 10000
```

### **5. Автоматическое развертывание:**
- Render автоматически развернет API при каждом push в main
- Получите URL вида: `https://helpdesk-chat-api.onrender.com`

## 🔧 **Обновление мини-приложения:**

После получения URL API обновите `frontend/production.html`:
```javascript
// Замените все вхождения localhost:3001 на ваш Render URL
const apiUrl = `https://ваш-api-url.onrender.com/api/chat-members?chat_id=${chatId}`;
```

## 🎯 **Результат:**
- ✅ **Публичный API** доступен всем пользователям
- ✅ **Реальные участники чата** в мини-приложении
- ✅ **Полностью рабочий продакшен**
- ✅ **Автоматическое обновление** при изменениях

## 🚀 **Запуск:**
1. Разверните API на Render.com
2. Обновите URL в мини-приложении
3. Отправьте изменения в GitHub Pages
4. Готово! 🎉
