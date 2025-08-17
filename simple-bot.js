const https = require('https');

const BOT_TOKEN = '8465643840:AAEWFjl1h-EY3150NgihSG2HAaVYLci14Rk';
let offset = 0;

// Функция для выполнения HTTP запросов к Telegram API
function makeRequest(method, data = null) {
    return new Promise((resolve, reject) => {
        const postData = data ? JSON.stringify(data) : '';
        
        const options = {
            hostname: 'api.telegram.org',
            port: 443,
            path: `/bot${BOT_TOKEN}/${method}`,
            method: 'POST',
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
                        resolve(result.result);
                    } else {
                        reject(new Error(`Telegram API error: ${result.description}`));
                    }
                } catch (error) {
                    reject(new Error(`Failed to parse response: ${error.message}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (postData) {
            req.write(postData);
        }
        
        req.end();
    });
}

// Отправляем сообщение
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
        
        await makeRequest('sendMessage', data);
    } catch (error) {
        console.error('Ошибка при отправке сообщения:', error.message);
    }
}

// Обрабатываем команду /start
async function handleStart(chatId, username = '') {
    const welcomeText = `🚀 <b>Добро пожаловать в Helpdesk Park!</b>

Система управления заявками парка аттракционов теперь доступна прямо в Telegram!

<b>Что вы можете делать:</b>
• 📋 Просматривать все заявки
• ➕ Создавать новые заявки
• 📊 Анализировать статистику
• 👤 Управлять профилем
• 🔔 Получать уведомления

Нажмите кнопку ниже, чтобы запустить приложение!`;

    const keyboard = {
        inline_keyboard: [
            [
                {
                    text: '🚀 Запустить Helpdesk Park',
                                            web_app: {
                            url: 'http://localhost:8080'
                        }
                }
            ],
            [
                {
                    text: '📋 Мои заявки',
                    callback_data: 'my_tickets'
                },
                {
                    text: '➕ Создать заявку',
                    callback_data: 'create_ticket'
                }
            ],
            [
                {
                    text: '📊 Статистика',
                    callback_data: 'stats'
                },
                {
                    text: '👤 Профиль',
                    callback_data: 'profile'
                }
            ],
            [
                {
                    text: '❓ Помощь',
                    callback_data: 'help'
                }
            ]
        ]
    };

    await sendMessage(chatId, welcomeText, keyboard);
}

// Обрабатываем callback запросы
async function handleCallback(chatId, callbackData) {
    let responseText = '';
    
    switch (callbackData) {
        case 'my_tickets':
            responseText = `📋 <b>Ваши заявки:</b>

• <b>Не работает аттракцион</b> (Высокий приоритет)
  Статус: В работе
  Создано: 2 часа назад

• <b>Проблема с освещением</b> (Средний приоритет)
  Статус: Открыта
  Создано: 1 день назад

Нажмите "🚀 Запустить Helpdesk Park" для полного управления!`;
            break;
            
        case 'create_ticket':
            responseText = `➕ <b>Создание новой заявки</b>

Для создания заявки запустите приложение и перейдите в раздел "Создать".

Или опишите проблему здесь, и мы создадим заявку за вас:

<b>Формат:</b>
• Название: краткое описание
• Описание: подробности проблемы
• Приоритет: низкий/средний/высокий/критический`;
            break;
            
        case 'stats':
            responseText = `📊 <b>Статистика заявок:</b>

<b>Общая статистика:</b>
• Всего заявок: 25
• Активных: 12
• В работе: 3
• Решенных сегодня: 8
• Критических: 1

<b>По приоритетам:</b>
• Высокий: 5 заявок
• Средний: 12 заявок
• Низкий: 8 заявок

Для детальной статистики запустите приложение!`;
            break;
            
        case 'profile':
            responseText = `👤 <b>Ваш профиль:</b>

<b>Основная информация:</b>
• Имя: ${username || 'Пользователь'}
• Роль: Оператор
• Доступ: Полный
• Последний вход: Сегодня

<b>Настройки:</b>
• Уведомления: Включены
• Язык: Русский
• Тема: Авто

Для изменения настроек запустите приложение!`;
            break;
            
        case 'help':
            responseText = `❓ <b>Справка по Helpdesk Park</b>

<b>Основные команды:</b>
• /start - Запустить приложение
• /help - Показать эту справку

<b>Как использовать:</b>
1. Нажмите "🚀 Запустить Helpdesk Park"
2. Войдите в систему через Telegram
3. Используйте интерфейс для управления заявками

<b>Поддержка:</b>
Если у вас возникли вопросы, обратитесь к администратору системы.

<b>Быстрые действия:</b>
• Создать заявку: нажмите "➕ Создать заявку"
• Просмотр заявок: нажмите "📋 Мои заявки"
• Статистика: нажмите "📊 Статистика"`;
            break;
            
        default:
            responseText = '❓ Неизвестная команда. Используйте /start для начала работы.';
    }
    
    await sendMessage(chatId, responseText);
}

// Получаем обновления
async function getUpdates() {
    try {
        const updates = await makeRequest('getUpdates', {
            offset: offset,
            timeout: 30
        });
        
        if (updates && updates.length > 0) {
            for (const update of updates) {
                offset = update.update_id + 1;
                
                if (update.message) {
                    const message = update.message;
                    const chatId = message.chat.id;
                    const text = message.text || '';
                    const username = message.from.username || message.from.first_name;
                    
                    console.log(`📨 Новое сообщение от @${username}: ${text}`);
                    
                    if (text === '/start') {
                        await handleStart(chatId, username);
                    } else if (text === '/help') {
                        await handleCallback(chatId, 'help');
                    } else if (text.startsWith('• Название:') || text.startsWith('• Описание:')) {
                        // Обработка создания заявки через текст
                        await sendMessage(chatId, `✅ <b>Заявка создана!</b>

Мы получили вашу заявку и обрабатываем её. В ближайшее время с вами свяжется специалист.

Для отслеживания статуса используйте приложение или нажмите "📋 Мои заявки"`);
                    }
                } else if (update.callback_query) {
                    const callbackQuery = update.callback_query;
                    const chatId = callbackQuery.message.chat.id;
                    const callbackData = callbackQuery.data;
                    
                    console.log(`🔘 Callback: ${callbackData}`);
                    
                    await handleCallback(chatId, callbackData);
                    
                    // Отвечаем на callback
                    await makeRequest('answerCallbackQuery', {
                        callback_query_id: callbackQuery.id
                    });
                }
            }
        }
    } catch (error) {
        console.error('Ошибка при получении обновлений:', error.message);
    }
}

// Основной цикл бота
async function runBot() {
    console.log('🤖 Бот Helpdesk Park запущен!');
    console.log('📱 Отправьте /start боту для начала работы');
    console.log('🔗 Бот: @helpdeskParkApp_bot');
    console.log('🌐 Мини-приложение: http://localhost:3000');
    console.log('\n⏳ Ожидаем сообщения...\n');
    
    // Запускаем цикл получения обновлений
    setInterval(getUpdates, 1000);
}

// Запускаем бота
runBot().catch(console.error);

// Обработка завершения
process.on('SIGINT', () => {
    console.log('\n🛑 Останавливаем бота...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Получен сигнал SIGTERM, останавливаем бота...');
    process.exit(0);
});
