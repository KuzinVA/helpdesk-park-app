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

// Удаляем webhook
async function deleteWebhook() {
    try {
        console.log('🗑️ Удаляем webhook...');
        const result = await makeRequest('deleteWebhook');
        console.log('✅ Webhook удален:', result);
        return result;
    } catch (error) {
        console.error('❌ Ошибка при удалении webhook:', error.message);
        throw error;
    }
}

// Получаем информацию о webhook
async function getWebhookInfo() {
    try {
        console.log('📡 Получаем информацию о webhook...');
        const result = await makeRequest('getWebhookInfo');
        console.log('✅ Информация о webhook:', result);
        return result;
    } catch (error) {
        console.error('❌ Ошибка при получении информации о webhook:', error.message);
        throw error;
    }
}

// Тестируем бота
async function testBot() {
    try {
        console.log('🧪 Тестируем бота...');
        const result = await makeRequest('getMe');
        console.log('✅ Бот работает:', result);
        return result;
    } catch (error) {
        console.error('❌ Ошибка при тестировании бота:', error.message);
        throw error;
    }
}

// Основная функция
async function fixWebhook() {
    try {
        console.log('🔧 Исправляем проблему с webhook...\n');
        
        // Получаем информацию о webhook
        await getWebhookInfo();
        
        // Удаляем webhook
        await deleteWebhook();
        
        // Тестируем бота
        await testBot();
        
        console.log('\n🎉 Webhook исправлен! Теперь бот может получать сообщения.');
        console.log('\n📱 Теперь вы можете:');
        console.log('1. Отправить /start боту');
        console.log('2. Бот должен ответить');
        console.log('3. Запустить мини-приложение');
        
    } catch (error) {
        console.error('\n💥 Ошибка при исправлении webhook:', error.message);
        process.exit(1);
    }
}

// Запускаем исправление
fixWebhook();
