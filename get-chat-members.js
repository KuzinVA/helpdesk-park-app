const https = require('https');

const BOT_TOKEN = '8465643840:AAEWFjl1h-EY3150NgihSG2HAaVYLci14Rk';

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

// Получить информацию о чате
async function getChatInfo(chatId) {
    try {
        console.log(`📋 Получаем информацию о чате ${chatId}...`);
        const chatInfo = await makeRequest('getChat', { chat_id: chatId });
        console.log('✅ Информация о чате получена:');
        console.log(`   Название: ${chatInfo.title || chatInfo.first_name}`);
        console.log(`   Тип: ${chatInfo.type}`);
        console.log(`   ID: ${chatInfo.id}`);
        return chatInfo;
    } catch (error) {
        console.error(`❌ Ошибка получения информации о чате: ${error.message}`);
        return null;
    }
}

// Получить количество участников в чате
async function getChatMemberCount(chatId) {
    try {
        console.log(`👥 Получаем количество участников в чате ${chatId}...`);
        const memberCount = await makeRequest('getChatMemberCount', { chat_id: chatId });
        console.log(`✅ Количество участников: ${memberCount}`);
        return memberCount;
    } catch (error) {
        console.error(`❌ Ошибка получения количества участников: ${error.message}`);
        return null;
    }
}

// Получить администраторов чата
async function getChatAdministrators(chatId) {
    try {
        console.log(`👑 Получаем администраторов чата ${chatId}...`);
        const admins = await makeRequest('getChatAdministrators', { chat_id: chatId });
        console.log(`✅ Найдено администраторов: ${admins.length}`);
        
        admins.forEach((admin, index) => {
            const user = admin.user;
            const status = admin.status;
            console.log(`   ${index + 1}. ${user.first_name} ${user.last_name || ''} (@${user.username || 'без username'}) - ${status}`);
        });
        
        return admins;
    } catch (error) {
        console.error(`❌ Ошибка получения администраторов: ${error.message}`);
        return null;
    }
}

// Получить участника чата по ID
async function getChatMember(chatId, userId) {
    try {
        console.log(`👤 Получаем информацию об участнике ${userId} в чате ${chatId}...`);
        const member = await makeRequest('getChatMember', { chat_id: chatId, user_id: userId });
        console.log('✅ Информация об участнике получена:');
        console.log(`   Имя: ${member.user.first_name} ${member.user.last_name || ''}`);
        console.log(`   Username: @${member.user.username || 'отсутствует'}`);
        console.log(`   Статус: ${member.status}`);
        console.log(`   Присоединился: ${new Date(member.joined_date * 1000).toLocaleString('ru-RU')}`);
        return member;
    } catch (error) {
        console.error(`❌ Ошибка получения информации об участнике: ${error.message}`);
        return null;
    }
}

// Основная функция
async function main() {
    console.log('🚀 Скрипт для работы с участниками Telegram чата\n');
    
    // Примеры использования
    const chatId = process.argv[2] || '-1001234567890'; // ID чата (отрицательный для групп)
    const userId = process.argv[3] || '123456789'; // ID пользователя
    
    console.log(`📋 Работаем с чатом: ${chatId}`);
    console.log(`👤 И пользователем: ${userId}\n`);
    
    try {
        // Получаем информацию о чате
        const chatInfo = await getChatInfo(chatId);
        if (chatInfo) {
            console.log('');
            
            // Получаем количество участников
            const memberCount = await getChatMemberCount(chatId);
            if (memberCount) {
                console.log('');
                
                // Получаем администраторов
                const admins = await getChatAdministrators(chatId);
                if (admins) {
                    console.log('');
                    
                    // Получаем информацию об участнике
                    const member = await getChatMember(chatId, userId);
                    if (member) {
                        console.log('');
                        console.log('🎉 Все операции выполнены успешно!');
                    }
                }
            }
        }
        
    } catch (error) {
        console.error(`❌ Критическая ошибка: ${error.message}`);
    }
    
    console.log('\n📚 Инструкция по использованию:');
    console.log('1. Добавьте бота в групповой чат');
    console.log('2. Получите ID чата (отрицательное число)');
    console.log('3. Запустите: node get-chat-members.js CHAT_ID USER_ID');
    console.log('4. Или просто: node get-chat-members.js для демо');
}

// Запуск скрипта
if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    makeRequest,
    getChatInfo,
    getChatMemberCount,
    getChatAdministrators,
    getChatMember
};
