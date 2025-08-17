const https = require('https');

const BOT_TOKEN = '8465643840:AAEWFjl1h-EY3150NgihSG2HAaVYLci14Rk';

console.log('🔍 Проверяем, в каких чатах находится бот...');
console.log(`🔑 Токен: ${BOT_TOKEN.substring(0, 10)}...`);

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

// Получение информации о боте
async function getBotInfo() {
    try {
        console.log('📋 Получаем информацию о боте...');
        const response = await makeRequest('getMe');
        console.log('✅ Информация о боте:', response.result);
        return response.result;
    } catch (error) {
        console.error('❌ Ошибка при получении информации о боте:', error.message);
        throw error;
    }
}

// Получение последних обновлений для проверки чатов
async function getUpdates() {
    try {
        console.log('📡 Получаем последние обновления...');
        const response = await makeRequest('getUpdates?limit=100');
        console.log(`✅ Получено ${response.result.length} обновлений`);
        return response.result;
    } catch (error) {
        console.error('❌ Ошибка при получении обновлений:', error.message);
        throw error;
    }
}

// Анализ обновлений для поиска чатов
function analyzeUpdates(updates) {
    const chats = new Map();
    
    updates.forEach(update => {
        if (update.message) {
            const chat = update.message.chat;
            if (chat) {
                const chatKey = `${chat.type}_${chat.id}`;
                if (!chats.has(chatKey)) {
                    chats.set(chatKey, {
                        id: chat.id,
                        type: chat.type,
                        title: chat.title || chat.first_name || chat.username || 'Unknown',
                        username: chat.username,
                        first_name: chat.first_name,
                        last_name: chat.last_name
                    });
                }
            }
        }
        
        if (update.my_chat_member) {
            const chat = update.my_chat_member.chat;
            if (chat) {
                const chatKey = `${chat.type}_${chat.id}`;
                if (!chats.has(chatKey)) {
                    chats.set(chatKey, {
                        id: chat.id,
                        type: chat.type,
                        title: chat.title || chat.first_name || chat.username || 'Unknown',
                        username: chat.username,
                        first_name: chat.first_name,
                        last_name: chat.last_name
                    });
                }
            }
        }
    });
    
    return Array.from(chats.values());
}

// Основная функция
async function main() {
    try {
        console.log('🚀 Начинаем проверку чатов бота...\n');
        
        // 1. Получаем информацию о боте
        const botInfo = await getBotInfo();
        console.log(`\n🤖 Бот: @${botInfo.username} (${botInfo.first_name})`);
        console.log(`🆔 Bot ID: ${botInfo.id}`);
        console.log(`👥 Может присоединяться к группам: ${botInfo.can_join_groups ? 'Да' : 'Нет'}`);
        console.log(`📖 Может читать все сообщения: ${botInfo.can_read_all_group_messages ? 'Да' : 'Нет'}\n`);
        
        // 2. Получаем обновления
        const updates = await getUpdates();
        
        if (updates.length === 0) {
            console.log('📭 Обновлений нет. Попробуйте отправить боту сообщение /start');
            return;
        }
        
        // 3. Анализируем чаты
        const chats = analyzeUpdates(updates);
        
        if (chats.length === 0) {
            console.log('❌ Чаты не найдены в обновлениях');
            return;
        }
        
        console.log(`\n🎯 Найдено ${chats.length} чатов:\n`);
        
        chats.forEach((chat, index) => {
            console.log(`${index + 1}. ${chat.title}`);
            console.log(`   🆔 Chat ID: ${chat.id}`);
            console.log(`   👥 Тип: ${chat.type}`);
            if (chat.username) {
                console.log(`   🔗 Username: @${chat.username}`);
            }
            console.log('');
        });
        
        // 4. Проверяем доступ к каждому чату
        console.log('🔍 Проверяем доступ к чатам...\n');
        
        for (const chat of chats) {
            try {
                console.log(`🔍 Проверяем чат: ${chat.title} (ID: ${chat.id})`);
                
                // Пробуем получить информацию о чате
                const chatInfo = await makeRequest(`getChat?chat_id=${chat.id}`);
                
                if (chatInfo.result) {
                    const chatData = chatInfo.result;
                    console.log(`✅ Доступ к чату есть!`);
                    console.log(`   📝 Название: ${chatData.title || chatData.first_name || 'Unknown'}`);
                    console.log(`   🆔 Chat ID: ${chatData.id}`);
                    console.log(`   👥 Тип: ${chatData.type}`);
                    
                    // Пробуем получить количество участников
                    try {
                        const memberCount = await makeRequest(`getChatMemberCount?chat_id=${chat.id}`);
                        console.log(`   👥 Участников: ${memberCount.result}`);
                    } catch (error) {
                        console.log(`   ⚠️ Не удалось получить количество участников: ${error.message}`);
                    }
                    
                    // Пробуем получить информацию о боте в чате
                    try {
                        const botMember = await makeRequest(`getChatMember?chat_id=${chat.id}&user_id=${botInfo.id}`);
                        if (botMember.result) {
                            const member = botMember.result;
                            console.log(`   🤖 Статус бота: ${member.status}`);
                            console.log(`   🔐 Права: ${member.status === 'administrator' ? 'Администратор' : 'Участник'}`);
                        }
                    } catch (error) {
                        console.log(`   ⚠️ Не удалось получить информацию о боте: ${error.message}`);
                    }
                    
                    console.log('');
                    
                    // Если это группа или супергруппа, предлагаем использовать
                    if (chatData.type === 'supergroup' || chatData.type === 'group') {
                        console.log(`💡 Этот чат можно использовать для Helpdesk Park!`);
                        console.log(`🚀 Запустите Chat API:`);
                        console.log(`node chat-api.js`);
                        console.log(`📡 Протестируйте API:`);
                        console.log(`curl "http://localhost:3001/api/chat-members?chat_id=${chat.id}"`);
                        console.log('');
                    }
                }
                
            } catch (error) {
                console.log(`❌ Нет доступа к чату ${chat.title}: ${error.message}\n`);
            }
        }
        
    } catch (error) {
        console.error('❌ Критическая ошибка:', error.message);
    }
}

// Запуск
main().catch(console.error);
