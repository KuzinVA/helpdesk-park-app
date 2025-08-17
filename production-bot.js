const https = require('https');

const BOT_TOKEN = '8465643840:AAEWFjl1h-EY3150NgihSG2HAaVYLci14Rk';
const GITHUB_PAGES_URL = 'https://KuzinVA.github.io/helpdesk-park-app/';

console.log('🚀 Запуск Production бота Helpdesk Park...');
console.log(`🔑 Токен: ${BOT_TOKEN.substring(0, 10)}...`);
console.log(`🌐 GitHub Pages URL: ${GITHUB_PAGES_URL}`);

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

// Отправка сообщения
async function sendMessage(chatId, text, replyMarkup = null) {
    try {
        const data = {
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML'
        };
        
        if (replyMarkup) {
            data.reply_markup = replyMarkup;
        }
        
        const response = await makeRequest('sendMessage', data);
        console.log(`✅ Сообщение отправлено в чат ${chatId}`);
        return response;
    } catch (error) {
        console.error(`❌ Ошибка при отправке сообщения в чат ${chatId}:`, error.message);
        throw error;
    }
}

// Обработка команды /start
async function handleStart(chatId) {
    try {
        console.log(`🚀 Обрабатываем команду /start для чата ${chatId}`);
        
        const welcomeText = `🎉 <b>Добро пожаловать в Helpdesk Park!</b>

🚀 <b>Система управления заявками</b> для вашей команды

<b>Возможности:</b>
✅ Создание и управление заявками
✅ Назначение ответственных
✅ Отслеживание статусов
✅ Уведомления в Telegram
✅ Статистика и аналитика

<b>Нажмите кнопку ниже, чтобы запустить приложение:</b>`;

        const replyMarkup = {
            inline_keyboard: [[
                {
                    text: '🚀 Запустить Helpdesk Park',
                    url: GITHUB_PAGES_URL
                }
            ]]
        };
        
        await sendMessage(chatId, welcomeText, replyMarkup);
        
    } catch (error) {
        console.error(`❌ Ошибка при обработке /start:`, error.message);
        throw error;
    }
}

// Обработка команды /help
async function handleHelp(chatId) {
    try {
        console.log(`❓ Обрабатываем команду /help для чата ${chatId}`);
        
        const helpText = `📚 <b>Справка по Helpdesk Park</b>

<b>Команды:</b>
/start - Запустить приложение
/help - Показать эту справку
/tickets - Информация о заявках
/stats - Статистика системы

<b>Поддержка:</b>
Если у вас возникли вопросы, обратитесь к администратору системы.

<b>Версия:</b> 2.6.0 (Production)`;
        
        await sendMessage(chatId, helpText);
        
    } catch (error) {
        console.error(`❌ Ошибка при обработке /help:`, error.message);
        throw error;
    }
}

// Обработка команды /tickets
async function handleTickets(chatId) {
    try {
        console.log(`📋 Обрабатываем команду /tickets для чата ${chatId}`);
        
        const ticketsText = `📋 <b>Информация о заявках</b>

<b>Для работы с заявками:</b>
1. Нажмите /start
2. Выберите "🚀 Запустить Helpdesk Park"
3. В приложении перейдите на вкладку "Заявки"

<b>Функции:</b>
✅ Создание новых заявок
✅ Просмотр существующих
✅ Назначение ответственных
✅ Изменение статусов
✅ Добавление комментариев

<b>Статусы заявок:</b>
🆕 Новые
🔄 В работе
✅ Завершенные
❌ Отмененные`;
        
        const replyMarkup = {
            inline_keyboard: [[
                {
                    text: '🚀 Открыть приложение',
                    url: GITHUB_PAGES_URL
                }
            ]]
        };
        
        await sendMessage(chatId, ticketsText, replyMarkup);
        
    } catch (error) {
        console.error(`❌ Ошибка при обработке /tickets:`, error.message);
        throw error;
    }
}

// Обработка команды /stats
async function handleStats(chatId) {
    try {
        console.log(`📊 Обрабатываем команду /stats для чата ${chatId}`);
        
        const statsText = `📊 <b>Статистика Helpdesk Park</b>

<b>Система:</b>
🟢 Статус: Активна
📱 Версия: 2.6.0
🌐 Платформа: Production
🔗 URL: ${GITHUB_PAGES_URL}

<b>Функциональность:</b>
✅ Telegram Bot API
✅ Chat Integration
✅ Real-time участники
✅ Уведомления
✅ Responsive UI

<b>Для детальной статистики:</b>
1. Нажмите /start
2. Запустите приложение
3. Перейдите на вкладку "Статистика"`;
        
        const replyMarkup = {
            inline_keyboard: [[
                {
                    text: '📊 Открыть статистику',
                    url: GITHUB_PAGES_URL
                }
            ]]
        };
        
        await sendMessage(chatId, statsText, replyMarkup);
        
    } catch (error) {
        console.error(`❌ Ошибка при обработке /stats:`, error.message);
        throw error;
    }
}

// Обработка callback query
async function handleCallback(chatId, data) {
    try {
        console.log(`🔘 Обрабатываем callback: ${data}`);
        
        switch (data) {
            case 'start_app':
                await handleStart(chatId);
                break;
            case 'help':
                await handleHelp(chatId);
                break;
            case 'tickets':
                await handleTickets(chatId);
                break;
            case 'stats':
                await handleStats(chatId);
                break;
            default:
                console.log(`⚠️ Неизвестный callback: ${data}`);
        }
        
    } catch (error) {
        console.error(`❌ Ошибка при обработке callback:`, error.message);
    }
}

// Получение обновлений
async function getUpdates(offset = 0) {
    try {
        const response = await makeRequest(`getUpdates?offset=${offset}&timeout=30`);
        return response.result;
    } catch (error) {
        console.error('❌ Ошибка при получении обновлений:', error.message);
        throw error;
    }
}

// Обработка обновления
async function handleUpdate(update) {
    try {
        const { update_id, message, callback_query } = update;
        
        if (message) {
            const { chat, text, from } = message;
            
            if (text) {
                console.log(`👤 Сообщение от @${from.username || from.first_name} в чате ${chat.id}: ${text}`);
                
                switch (text) {
                    case '/start':
                        await handleStart(chat.id);
                        break;
                    case '/help':
                        await handleHelp(chat.id);
                        break;
                    case '/tickets':
                        await handleTickets(chat.id);
                        break;
                    case '/stats':
                        await handleStats(chat.id);
                        break;
                    default:
                        if (text.startsWith('/')) {
                            console.log(`⚠️ Неизвестная команда: ${text}`);
                            await sendMessage(chat.id, `❓ Неизвестная команда: ${text}\n\nИспользуйте /help для получения справки.`);
                        }
                }
            } else {
                console.log(`👤 Сообщение без текста от @${from.username || from.first_name} в чате ${chat.id}`);
            }
        }
        
        if (callback_query) {
            const { message, data, from } = callback_query;
            console.log(`🔘 Callback от @${from.username || from.first_name}: ${data}`);
            await handleCallback(message.chat.id, data);
        }
        
        return update_id;
        
    } catch (error) {
        console.error(`❌ Ошибка при обработке обновления ${update.update_id}:`, error.message);
        return update.update_id;
    }
}

// Основная функция бота
async function runBot() {
    let offset = 0;
    
    console.log('🚀 Бот запущен и ожидает сообщения...');
    console.log('📱 Отправьте /start боту @helpdeskParkApp_bot');
    console.log('⏰ Проверка обновлений каждые 5 секунд...\n');
    
    while (true) {
        try {
            const updates = await getUpdates(offset);
            
            if (updates && updates.length > 0) {
                console.log(`📨 Получено обновлений: ${updates.length}`);
                
                for (const update of updates) {
                    try {
                        const newOffset = await handleUpdate(update);
                        if (newOffset) {
                            offset = newOffset + 1;
                        }
                    } catch (error) {
                        console.error(`❌ Ошибка при обработке обновления ${update.update_id}:`, error.message);
                    }
                }
            }
            
            // Пауза между запросами
            await new Promise(resolve => setTimeout(resolve, 5000));
            
        } catch (error) {
            console.error('❌ Ошибка при получении обновлений:', error.message);
            
            // Пауза при ошибке
            await new Promise(resolve => setTimeout(resolve, 10000));
        }
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
    console.error('❌ Критическая ошибка:', error.message);
    process.exit(1);
});
