const https = require('https');

const BOT_TOKEN = '8465643840:AAEWFjl1h-EY3150NgihSG2HAaVYLci14Rk';
const INVITE_LINK = 'https://t.me/+grmdzW2hrEUyN2Qy';

console.log('🔍 Поиск чата по username...');
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

// Попытка получить информацию о чате по username
async function getChatByUsername(username) {
    try {
        console.log(`🔍 Ищем чат по username: @${username}`);
        const response = await makeRequest(`getChat?chat_id=@${username}`);
        console.log('✅ Информация о чате:', response.result);
        return response.result;
    } catch (error) {
        console.error(`❌ Ошибка при поиске чата @${username}:`, error.message);
        throw error;
    }
}

// Попытка получить информацию о чате по username без @
async function getChatByUsernameWithoutAt(username) {
    try {
        console.log(`🔍 Ищем чат по username без @: ${username}`);
        const response = await makeRequest(`getChat?chat_id=${username}`);
        console.log('✅ Информация о чате:', response.result);
        return response.result;
    } catch (error) {
        console.error(`❌ Ошибка при поиске чата ${username}:`, error.message);
        throw error;
    }
}

// Попытка получить информацию о чате по username с +
async function getChatByUsernameWithPlus(username) {
    try {
        console.log(`🔍 Ищем чат по username с +: +${username}`);
        const response = await makeRequest(`getChat?chat_id=+${username}`);
        console.log('✅ Информация о чате:', response.result);
        return response.result;
    } catch (error) {
        console.error(`❌ Ошибка при поиске чата +${username}:`, error.message);
        throw error;
    }
}

// Основная функция
async function main() {
    try {
        console.log('🚀 Начинаем поиск чата...\n');
        
        // Извлекаем username из invite link
        const match = INVITE_LINK.match(/t\.me\/\+([a-zA-Z0-9]+)/);
        if (match) {
            const username = match[1];
            console.log(`📝 Извлечен username: ${username}`);
            console.log(`🔗 Полная ссылка: https://t.me/+${username}\n`);
            
            // Пробуем разные варианты поиска
            const searchMethods = [
                { name: 'с @', method: () => getChatByUsername(username) },
                { name: 'без @', method: () => getChatByUsernameWithoutAt(username) },
                { name: 'с +', method: () => getChatByUsernameWithPlus(username) }
            ];
            
            for (const searchMethod of searchMethods) {
                try {
                    console.log(`\n🔍 Попытка поиска ${searchMethod.name}...`);
                    const chat = await searchMethod.method();
                    
                    if (chat) {
                        console.log(`\n🎯 Чат найден методом "${searchMethod.name}"!`);
                        console.log(`📝 Название: ${chat.title}`);
                        console.log(`🆔 Chat ID: ${chat.id}`);
                        console.log(`👥 Тип: ${chat.type}`);
                        console.log(`🔗 Username: ${chat.username ? '@' + chat.username : 'Нет'}`);
                        
                        if (chat.type === 'supergroup' || chat.type === 'group') {
                            console.log(`\n💡 Для получения участников используйте:`);
                            console.log(`curl "http://localhost:3001/api/chat-members?chat_id=${chat.id}"`);
                            
                            console.log(`\n🚀 Теперь запустите Chat API:`);
                            console.log(`node chat-api.js`);
                        }
                        
                        return;
                    }
                } catch (error) {
                    console.log(`❌ Метод "${searchMethod.name}" не сработал: ${error.message}`);
                }
            }
            
            console.log('\n❌ Все методы поиска не сработали');
            console.log('\n📋 Возможные причины:');
            console.log('1. Бот не добавлен в чат');
            console.log('2. У бота нет прав администратора');
            console.log('3. Чат приватный и требует специальных прав');
            console.log('4. Username чата изменился');
            
        } else {
            console.log('❌ Не удалось извлечь username из invite link');
        }
        
    } catch (error) {
        console.error('❌ Критическая ошибка:', error.message);
    }
}

// Запуск
main().catch(console.error);
