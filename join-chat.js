const https = require('https');

const BOT_TOKEN = '8465643840:AAEWFjl1h-EY3150NgihSG2HAaVYLci14Rk';
const INVITE_LINK = 'https://t.me/+grmdzW2hrEUyN2Qy';

console.log('🤖 Скрипт для работы с чатом Helpdesk Park...');
console.log(`🔑 Токен: ${BOT_TOKEN.substring(0, 10)}...`);
console.log(`🔗 Ссылка на чат: ${INVITE_LINK}`);

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

// Попытка получить информацию о чате по username
async function getChatByUsername(username) {
    try {
        console.log(`🔍 Ищем чат по username: ${username}`);
        const response = await makeRequest(`getChat?chat_id=@${username}`);
        console.log('✅ Информация о чате:', response.result);
        return response.result;
    } catch (error) {
        console.error(`❌ Ошибка при поиске чата @${username}:`, error.message);
        throw error;
    }
}

// Попытка получить информацию о чате по ID
async function getChatById(chatId) {
    try {
        console.log(`🔍 Ищем чат по ID: ${chatId}`);
        const response = await makeRequest(`getChat?chat_id=${chatId}`);
        console.log('✅ Информация о чате:', response.result);
        return response.result;
    } catch (error) {
        console.error(`❌ Ошибка при поиске чата ${chatId}:`, error.message);
        throw error;
    }
}

// Попытка получить информацию о чате по invite link
async function getChatByInviteLink(inviteLink) {
    try {
        console.log(`🔍 Ищем чат по invite link: ${inviteLink}`);
        
        // Извлекаем username из invite link
        const match = inviteLink.match(/t\.me\/\+([a-zA-Z0-9]+)/);
        if (match) {
            const username = match[1];
            console.log(`📝 Извлечен username: ${username}`);
            
            // Пробуем получить информацию о чате
            const response = await makeRequest(`getChat?chat_id=@${username}`);
            console.log('✅ Информация о чате:', response.result);
            return response.result;
        } else {
            throw new Error('Не удалось извлечь username из invite link');
        }
    } catch (error) {
        console.error(`❌ Ошибка при поиске чата по invite link:`, error.message);
        throw error;
    }
}

// Основная функция
async function main() {
    try {
        console.log('🚀 Начинаем работу с чатом...\n');
        
        // 1. Получаем информацию о боте
        const botInfo = await getBotInfo();
        console.log(`\n🤖 Бот: @${botInfo.username} (${botInfo.first_name})`);
        console.log(`🆔 Bot ID: ${botInfo.id}\n`);
        
        // 2. Пробуем разные способы найти чат
        console.log('🔍 Поиск чата...\n');
        
        // Пробуем по invite link
        try {
            const chatByInvite = await getChatByInviteLink(INVITE_LINK);
            console.log(`\n🎯 Чат найден по invite link!`);
            console.log(`📝 Название: ${chatByInvite.title}`);
            console.log(`🆔 Chat ID: ${chatByInvite.id}`);
            console.log(`👥 Тип: ${chatByInvite.type}`);
            
            if (chatByInvite.type === 'supergroup' || chatByInvite.type === 'group') {
                console.log(`\n💡 Для получения участников используйте:`);
                console.log(`curl "http://localhost:3001/api/chat-members?chat_id=${chatByInvite.id}"`);
            }
            
        } catch (error) {
            console.log('❌ Не удалось найти чат по invite link');
        }
        
        // Пробуем по возможным ID
        const possibleIds = [4896951550, -4896951550, 1004896951550, -1004896951550];
        
        for (const chatId of possibleIds) {
            try {
                const chatById = await getChatById(chatId);
                console.log(`\n🎯 Чат найден по ID ${chatId}!`);
                console.log(`📝 Название: ${chatById.title}`);
                console.log(`🆔 Chat ID: ${chatById.id}`);
                console.log(`👥 Тип: ${chatById.type}`);
                
                if (chatById.type === 'supergroup' || chatById.type === 'group') {
                    console.log(`\n💡 Для получения участников используйте:`);
                    console.log(`curl "http://localhost:3001/api/chat-members?chat_id=${chatById.id}"`);
                }
                
                break;
            } catch (error) {
                console.log(`❌ Chat ID ${chatId} не найден`);
            }
        }
        
        console.log('\n📋 Инструкции:');
        console.log('1. Добавьте бота @helpdeskParkApp_bot в чат');
        console.log('2. Дайте боту права администратора');
        console.log('3. Используйте найденный Chat ID для API запросов');
        
    } catch (error) {
        console.error('❌ Критическая ошибка:', error.message);
    }
}

// Запуск
main().catch(console.error);
