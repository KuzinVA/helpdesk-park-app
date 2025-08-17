const https = require('https');
const http = require('http');
const url = require('url');

const BOT_TOKEN = process.env.BOT_TOKEN || '8465643840:AAEWFjl1h-EY3150NgihSG2HAaVYLci14Rk';
const PORT = process.env.PORT || 3001;

console.log('🚀 Запуск Chat API сервера...');
console.log(`🔑 Токен: ${BOT_TOKEN.substring(0, 10)}...`);
console.log(`🌐 Порт: ${PORT}`);

// Функция для выполнения HTTP запросов к Telegram API
function makeTelegramRequest(method, data = null) {
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

// Получение информации о чате
async function getChatInfo(chatId) {
    try {
        const response = await makeTelegramRequest(`getChat?chat_id=${chatId}`);
        return response.result;
    } catch (error) {
        console.error(`❌ Ошибка при получении информации о чате: ${error.message}`);
        throw error;
    }
}

// Получение количества участников чата
async function getChatMemberCount(chatId) {
    try {
        const response = await makeTelegramRequest(`getChatMemberCount?chat_id=${chatId}`);
        return response.result;
    } catch (error) {
        console.error(`❌ Ошибка при получении количества участников: ${error.message}`);
        throw error;
    }
}

// Получение администраторов чата
async function getChatAdministrators(chatId) {
    try {
        const response = await makeTelegramRequest(`getChatAdministrators?chat_id=${chatId}`);
        return response.result;
    } catch (error) {
        console.error(`❌ Ошибка при получении администраторов: ${error.message}`);
        throw error;
    }
}

// Получение информации об участнике чата
async function getChatMember(chatId, userId) {
    try {
        const response = await makeTelegramRequest(`getChatMember?chat_id=${chatId}&user_id=${userId}`);
        return response.result;
    } catch (error) {
        console.error(`❌ Ошибка при получении информации об участнике: ${error.message}`);
        throw error;
    }
}

// Получение всех участников чата (постранично)
async function getAllChatMembers(chatId) {
    try {
        console.log(`📡 Получаем участников чата ${chatId}...`);
        
        // Сначала получаем количество участников
        const memberCount = await getChatMemberCount(chatId);
        console.log(`👥 Всего участников в чате: ${memberCount}`);
        
        // Получаем администраторов
        const administrators = await getChatAdministrators(chatId);
        console.log(`👑 Администраторов: ${administrators.length}`);
        
        // Формируем список участников
        const members = [];
        
        // Добавляем администраторов
        for (const admin of administrators) {
            members.push({
                id: admin.user.id,
                username: admin.user.username,
                first_name: admin.user.first_name,
                last_name: admin.user.last_name,
                role: admin.status,
                is_admin: true
            });
        }
        
        console.log(`✅ Получено участников: ${members.length}`);
        return members;
        
    } catch (error) {
        console.error(`❌ Ошибка при получении участников чата: ${error.message}`);
        throw error;
    }
}

// Создание HTTP сервера
const server = http.createServer(async (req, res) => {
    // Настройка CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    
    try {
        if (path === '/api/chat-members' && req.method === 'GET') {
            const chatId = parsedUrl.query.chat_id;
            
            if (!chatId) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'chat_id parameter is required' }));
                return;
            }
            
            console.log(`📥 Запрос участников чата: ${chatId}`);
            const members = await getAllChatMembers(chatId);
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                chat_id: chatId,
                members: members,
                total_count: members.length
            }));
            
        } else if (path === '/api/chat-info' && req.method === 'GET') {
            const chatId = parsedUrl.query.chat_id;
            
            if (!chatId) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'chat_id parameter is required' }));
                return;
            }
            
            console.log(`📥 Запрос информации о чате: ${chatId}`);
            const chatInfo = await getChatInfo(chatId);
            const memberCount = await getChatMemberCount(chatId);
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                chat: chatInfo,
                member_count: memberCount
            }));
            
        } else if (path === '/api/health' && req.method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                status: 'OK',
                timestamp: new Date().toISOString(),
                bot_token: `${BOT_TOKEN.substring(0, 10)}...`
            }));
            
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Not Found' }));
        }
        
    } catch (error) {
        console.error(`❌ Ошибка при обработке запроса: ${error.message}`);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            error: 'Internal Server Error',
            message: error.message
        }));
    }
});

// Запуск сервера
server.listen(PORT, () => {
    console.log(`🚀 Chat API сервер запущен на порту ${PORT}`);
    console.log(`📡 API endpoints:`);
    console.log(`   GET /api/chat-members?chat_id=<ID> - получить участников чата`);
    console.log(`   GET /api/chat-info?chat_id=<ID> - получить информацию о чате`);
    console.log(`   GET /api/health - проверить статус сервера`);
    console.log(`\n💡 Пример использования:`);
    console.log(`   curl "http://localhost:${PORT}/api/chat-members?chat_id=-4896951550"`);
});

// Обработка сигналов завершения
process.on('SIGINT', () => {
    console.log('\n🛑 Получен сигнал SIGINT, останавливаем сервер...');
    server.close(() => {
        console.log('✅ Сервер остановлен');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Получен сигнал SIGTERM, останавливаем сервер...');
    server.close(() => {
        console.log('✅ Сервер остановлен');
        process.exit(0);
    });
});
