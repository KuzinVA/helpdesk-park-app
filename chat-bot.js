const https = require('https');

const BOT_TOKEN = '8465643840:AAEWFjl1h-EY3150NgihSG2HAaVYLci14Rk';
const TARGET_CHAT_ID = -4896951550; // ID вашего чата
let offset = 0;

console.log('🤖 Запуск бота для чата Helpdesk Park...');
console.log(`🔑 Токен: ${BOT_TOKEN.substring(0, 10)}...`);
console.log(`💬 Целевой чат ID: ${TARGET_CHAT_ID}`);
console.log(`🌐 GitHub Pages URL: https://KuzinVA.github.io/helpdesk-park-app/`);

// Функция для выполнения HTTP запросов к Telegram API
function makeRequest(method, data = null) {
    return new Promise((resolve, reject) => {
        const postData = data ? JSON.stringify(data) : '';
        
        const options = {
            hostname: 'api.telegram.org',
            port: 443,
            path: `/bot${BOT_TOKEN}/${method}`,
            method: data ? 'POST' : 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                try {
                    const result = JSON.parse(responseData);
                    if (result.ok) {
                        resolve(result);
                    } else {
                        reject(new Error(`Telegram API error: ${result.description}`));
                    }
                } catch (error) {
                    reject(new Error(`JSON parse error: ${error.message}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(new Error(`Request error: ${error.message}`));
        });

        if (postData) {
            req.write(postData);
        }
        
        req.end();
    });
}

// Функция для отправки сообщений
async function sendMessage(chatId, text, keyboard = null) {
    try {
        const messageData = {
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML'
        };

        if (keyboard) {
            messageData.reply_markup = keyboard;
        }

        const response = await makeRequest('sendMessage', messageData);
        console.log(`✅ Сообщение отправлено в чат ${chatId}`);
        return response;
    } catch (error) {
        console.error(`❌ Ошибка при отправке сообщения в чат ${chatId}: ${error.message}`);
        throw error;
    }
}

// Обработчик команды /start
async function handleStart(chatId, username = '') {
    try {
        console.log(`🚀 Обрабатываем команду /start для чата ${chatId}`);
        
        const welcomeText = `🎉 <b>Добро пожаловать в Helpdesk Park!</b>

🚀 Это система управления заявками и обращениями для парка развлечений.

<b>Возможности:</b>
• 📋 Создание и управление заявками
• 👥 Назначение ответственных
• 🔔 Автоматические уведомления
• 📊 Аналитика и отчеты
• 📱 Мобильная оптимизация

Нажмите кнопку ниже, чтобы запустить приложение!`;

        const keyboard = {
            inline_keyboard: [
                [{
                    text: '🚀 Запустить Helpdesk Park',
                    url: 'https://KuzinVA.github.io/helpdesk-park-app/'
                }],
                [{
                    text: '📋 Доступные команды',
                    callback_data: 'commands'
                }],
                [{
                    text: 'ℹ️ О приложении',
                    callback_data: 'about'
                }]
            ]
        };

        return await sendMessage(chatId, welcomeText, keyboard);
    } catch (error) {
        console.error(`❌ Ошибка при обработке /start: ${error.message}`);
        throw error;
    }
}

// Обработчик callback запросов
async function handleCallback(chatId, callbackData) {
    try {
        console.log(`🔄 Обрабатываем callback: ${callbackData} в чате ${chatId}`);
        
        let responseText = '';
        
        switch (callbackData) {
            case 'commands':
                responseText = `📋 <b>Доступные команды:</b>

🚀 /start - Запустить приложение
📋 /tickets - Просмотр заявок
➕ /create - Создать заявку
📊 /stats - Статистика
👤 /profile - Профиль
❓ /help - Помощь`;
                break;
                
            case 'about':
                responseText = `ℹ️ <b>О Helpdesk Park:</b>

🎯 Система управления заявками и обращениями
🌐 Telegram Mini App
🔒 Безопасная аутентификация через Telegram
📱 Адаптивный интерфейс
🎨 Поддержка тем Telegram
🔔 Автоматические уведомления`;
                break;
                
            default:
                responseText = `❓ Неизвестная команда: ${callbackData}`;
        }
        
        return await sendMessage(chatId, responseText);
    } catch (error) {
        console.error(`❌ Ошибка при обработке callback: ${error.message}`);
        throw error;
    }
}

// Получение обновлений от Telegram
async function getUpdates() {
    try {
        console.log(`📡 Получаем обновления (offset: ${offset})...`);
        
        const response = await makeRequest(`getUpdates?offset=${offset}&timeout=30`);
        
        if (!response || !response.result) {
            console.log('📭 Нет обновлений');
            return;
        }

        const updates = response.result;
        console.log(`📨 Получено обновлений: ${updates.length}`);

        for (const update of updates) {
            try {
                console.log(`📨 Обрабатываем обновление ID: ${update.update_id}`);
                
                if (update.message) {
                    const { chat, text, from } = update.message;
                    console.log(`👤 Сообщение от @${from.username || from.first_name} в чате ${chat.id}: ${text || 'без текста'}`);
                    
                    // Проверяем, что текст существует
                    if (text) {
                        if (text === '/start') {
                            await handleStart(chat.id, from.username);
                        } else if (text.startsWith('/')) {
                            await sendMessage(chat.id, `❓ Команда ${text} не реализована. Используйте /start для запуска приложения.`);
                        }
                    } else {
                        console.log(`👤 Сообщение без текста от @${from.username || from.first_name} в чате ${chat.id}`);
                    }
                } else if (update.callback_query) {
                    const { data, from, message } = update.callback_query;
                    console.log(`🔄 Callback от @${from.username || from.first_name}: ${data}`);
                    
                    await handleCallback(message.chat.id, data);
                }
                
                // Увеличиваем offset только при успешной обработке
                if (update.update_id >= offset) {
                    offset = update.update_id + 1;
                }
            } catch (error) {
                console.error(`❌ Ошибка при обработке обновления ${update.update_id}: ${error.message}`);
                // Продолжаем обработку других обновлений
            }
        }
        
    } catch (error) {
        console.error(`❌ Ошибка при получении обновлений: ${error.message}`);
        // Сбрасываем offset при критических ошибках
        offset = 0;
    }
}

// Отправка тестового сообщения в целевой чат
async function sendTestMessage() {
    try {
        console.log(`📤 Отправляем тестовое сообщение в чат ${TARGET_CHAT_ID}...`);
        
        const testText = `🤖 <b>Бот Helpdesk Park запущен!</b>

💬 Этот чат подключен к системе управления заявками.
🚀 Отправьте команду /start для запуска приложения.

<b>Статус:</b> ✅ АКТИВЕН
<b>Версия:</b> 2.2.1
<b>Чат ID:</b> ${TARGET_CHAT_ID}`;

        await sendMessage(TARGET_CHAT_ID, testText);
        console.log(`✅ Тестовое сообщение отправлено в чат ${TARGET_CHAT_ID}`);
        
    } catch (error) {
        console.error(`❌ Ошибка при отправке тестового сообщения: ${error.message}`);
    }
}

// Основная функция запуска бота
async function runBot() {
    try {
        console.log('🚀 Бот запущен и ожидает сообщения...');
        console.log(`📱 Отправьте /start боту @helpdeskParkApp_bot в чате ${TARGET_CHAT_ID}`);
        console.log('⏰ Проверка обновлений каждые 5 секунд...');
        
        // Отправляем тестовое сообщение в целевой чат
        await sendTestMessage();
        
        // Первая проверка
        await getUpdates();
        
        // Периодическая проверка
        setInterval(async () => {
            try {
                await getUpdates();
            } catch (error) {
                console.error(`❌ Ошибка в периодической проверке: ${error.message}`);
                // Сбрасываем offset при критических ошибках
                offset = 0;
            }
        }, 5000);
        
    } catch (error) {
        console.error(`❌ Критическая ошибка при запуске бота: ${error.message}`);
        throw error;
    }
}

// Обработка сигналов завершения
process.on('SIGINT', () => {
    console.log('\n🛑 Получен сигнал SIGINT, останавливаем бота...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Получен сигнал SIGTERM, останавливаем бота...');
    process.exit(0);
});

// Запуск бота
runBot().catch(error => {
    console.error(`❌ Критическая ошибка: ${error.message}`);
    process.exit(1);
});
