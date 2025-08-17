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

После развертывания обновите `frontend/production.html`:

```javascript
// Замените localhost:3001 на ваш Render URL
const response = await fetch(`https://helpdesk-chat-api.onrender.com/api/chat-members?chat_id=${chatId}`);
```

## ✅ **Результат:**
- Chat API будет доступен из интернета
- Мини-приложение сможет загружать реальных участников чата
- Полностью рабочий продакшен!

## 🆘 **Альтернативы:**
- **Railway.app** - аналогично Render
- **Heroku** - требует карту
- **Vercel** - только для frontend

## 📱 **Тестирование:**
После развертывания протестируйте API:
```bash
curl "https://helpdesk-chat-api.onrender.com/api/health"
curl "https://helpdesk-chat-api.onrender.com/api/chat-members?chat_id=-1002978831408"
```
