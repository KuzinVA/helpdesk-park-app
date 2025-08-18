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

// Тестируем настройку Mini App
async function testMiniApp() {
    try {
        console.log('🧪 Тестируем настройку Mini App...\n');
        
        // Проверяем текущие команды
        console.log('📋 Проверяем текущие команды...');
        const commands = await makeRequest('getMyCommands');
        console.log('✅ Команды получены:', commands);
        
        // Проверяем настройки меню
        console.log('\n🍔 Проверяем настройки меню...');
        const menuButton = await makeRequest('getChatMenuButton');
        console.log('✅ Настройки меню:', menuButton);
        
        // Тестируем отправку сообщения с Mini App кнопкой
        console.log('\n📱 Тестируем отправку сообщения с Mini App кнопкой...');
        
        const testMessage = {
            chat_id: 'YOUR_CHAT_ID', // Замените на ваш chat_id
            text: '🧪 Тест Mini App кнопки',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: '🚀 Запустить Helpdesk Park',
                            web_app: {
                                url: 'https://KuzinVA.github.io/helpdesk-park-app/'
                            }
                        }
                    ]
                ]
            }
        };
        
        console.log('📤 Отправляем тестовое сообщение...');
        console.log('⚠️  Для тестирования замените YOUR_CHAT_ID на ваш chat_id');
        console.log('📝 Пример команды для получения chat_id:');
        console.log('   curl "https://api.telegram.org/bot' + BOT_TOKEN + '/getUpdates"');
        
        console.log('\n✅ Тест завершен!');
        console.log('\n📱 Для проверки Mini App:');
        console.log('1. Отправьте боту команду /start');
        console.log('2. Нажмите кнопку "🚀 Запустить Helpdesk Park"');
        console.log('3. Приложение должно открыться как полноценный Mini App');
        
    } catch (error) {
        console.error('\n💥 Ошибка при тестировании:', error.message);
    }
}

// Запускаем тест
testMiniApp();
