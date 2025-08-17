const BOT_TOKEN = '8465643840:AAEWFjl1h-EY3150NgihSG2HAaVYLci14Rk';
let offset = 0;

console.log('🤖 Запуск бота Helpdesk Park...');
console.log(`🔑 Токен: ${BOT_TOKEN.substring(0, 10)}...`);
console.log(`🌐 GitHub Pages URL: https://KuzinVA.github.io/helpdesk-park-app/`);

async function makeRequest(method, data = null) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/${method}`;
    const options = {
        method: data ? 'POST' : 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        
        if (!result.ok) {
            console.error(`❌ Telegram API error: ${result.description}`);
            return null;
        }
        
        return result;
    } catch (error) {
        console.error(`❌ Network error: ${error.message}`);
        return null;
    }
}

async function sendMessage(chatId, text, keyboard = null) {
    const messageData = {
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML'
    };

    if (keyboard) {
        messageData.reply_markup = keyboard;
    }

    console.log(`📤 Отправляем сообщение в чат ${chatId}: ${text.substring(0, 50)}...`);
    
    const result = await makeRequest('sendMessage', messageData);
    if (result) {
        console.log(`✅ Сообщение отправлено успешно`);
        return result.result;
    } else {
        console.error(`❌ Ошибка отправки сообщения`);
        return null;
    }
}

async function handleStart(chatId, username = '') {
    console.log(`🚀 Обрабатываем команду /start для чата ${chatId}`);
    
    const welcomeText = `🎉 <b>Добро пожаловать в Helpdesk Park!</b>

🚀 Это мини-приложение для управления заявками и обращениями.

📱 Нажмите кнопку ниже, чтобы запустить приложение:`;

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
}

async function handleCallback(chatId, callbackData) {
    console.log(`🔄 Обрабатываем callback: ${callbackData}`);
    
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
🎨 Поддержка тем Telegram`;
            break;
            
        default:
            responseText = `❓ Неизвестная команда: ${callbackData}`;
    }
    
    return await sendMessage(chatId, responseText);
}

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
                    
                    // Проверяем, что текст существует
                    if (text) {
                        console.log(`👤 Сообщение от @${from.username || from.first_name} в чате ${chat.id}: ${text}`);
                        
                        if (text === '/start') {
                            await handleStart(chat.id, from.username);
                        } else if (text.startsWith('/')) {
                            await sendMessage(chat.id, `❓ Команда ${text} не реализована. Используйте /start для запуска приложения.`);
                        }
                    } else {
                        console.log(`👤 Сообщение без текста от @${from.username || from.first_name} в чате ${chat.id} (тип: ${update.message.message_type || 'неизвестно'})`);
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
    }
}

async function runBot() {
    console.log('🚀 Бот запущен и ожидает сообщения...');
    console.log('📱 Отправьте /start боту @helpdeskParkApp_bot');
    console.log('⏰ Проверка обновлений каждые 5 секунд...');
    
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
