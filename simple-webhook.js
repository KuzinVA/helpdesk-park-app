const express = require('express');
const crypto = require('crypto');
const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(express.static('frontend'));

// Telegram Bot Token
const BOT_TOKEN = '8465643840:AAEWFjl1h-EY3150NgihSG2HAaVYLci14Rk';

// Webhook для Telegram
app.post('/webhook', (req, res) => {
    const { message } = req.body;
    
    if (message && message.text) {
        const chatId = message.chat.id;
        const text = message.text;
        
        console.log(`Получено сообщение: ${text} от ${chatId}`);
        
        if (text === '/start') {
            // Отправляем приветствие с кнопкой для мини-аппа
            const response = {
                chat_id: chatId,
                text: '🎉 Добро пожаловать в Helpdesk Park App!\n\nНажмите кнопку ниже, чтобы открыть мини-приложение:',
                reply_markup: {
                    inline_keyboard: [[
                        {
                            text: '🚀 Открыть приложение',
                            web_app: {
                                url: `http://localhost:${PORT}/index-github.html`
                            }
                        }
                    ]]
                }
            };
            
            // Отправляем сообщение через Telegram Bot API
            fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(response)
            });
        }
    }
    
    res.sendStatus(200);
});

// Главная страница
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Helpdesk Park App - Webhook</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1>🚀 Helpdesk Park App Webhook</h1>
            <p>Сервер работает на порту ${PORT}</p>
            <p>Webhook: http://localhost:${PORT}/webhook</p>
            <p>Мини-апп: <a href="/index-github.html">Открыть</a></p>
        </body>
        </html>
    `);
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Webhook сервер запущен на порту ${PORT}`);
    console.log(`📱 Мини-апп доступен по адресу: http://localhost:${PORT}/index-github.html`);
    console.log(`🔗 Webhook: http://localhost:${PORT}/webhook`);
    console.log('');
    console.log('📋 Для настройки webhook выполните:');
    console.log(`curl -X POST "https://api.telegram.org/bot${BOT_TOKEN}/setWebhook" \\`);
    console.log(`     -H "Content-Type: application/json" \\`);
    console.log(`     -d '{"url": "http://localhost:${PORT}/webhook"}'`);
});
