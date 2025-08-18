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

// Настраиваем главное веб-приложение
async function setupMainWebApp() {
    try {
        console.log('🚀 Настройка главного веб-приложения...\n');
        
        // Устанавливаем главное веб-приложение
        console.log('📱 Устанавливаем главное веб-приложение...');
        const webAppResult = await makeRequest('setChatMenuButton', {
            menu_button: {
                type: 'web_app',
                text: '🚀 Helpdesk Park',
                web_app: {
                    url: 'https://KuzinVA.github.io/helpdesk-park-app/'
                }
            }
        });
        console.log('✅ Главное веб-приложение установлено:', webAppResult);
        
        // Устанавливаем команды
        console.log('\n📋 Устанавливаем команды...');
        const commandsResult = await makeRequest('setMyCommands', {
            commands: [
                {
                    command: 'start',
                    description: '🚀 Запустить Helpdesk Park'
                },
                {
                    command: 'app',
                    description: '📱 Открыть Mini App'
                },
                {
                    command: 'help',
                    description: '❓ Помощь'
                }
            ]
        });
        console.log('✅ Команды установлены:', commandsResult);
        
        // Проверяем результат
        console.log('\n🔍 Проверяем настройки...');
        const botInfo = await makeRequest('getMe');
        console.log('✅ Информация о боте:', botInfo);
        
        const menuButton = await makeRequest('getChatMenuButton');
        console.log('✅ Настройки меню:', menuButton);
        
        console.log('\n🎉 Настройка завершена успешно!');
        console.log('\n📱 Теперь бот должен:');
        console.log('1. Отвечать на команду /start');
        console.log('2. Показывать кнопку меню с Mini App');
        console.log('3. Правильно открывать Mini App');
        
        console.log('\n🔗 Для тестирования:');
        console.log('1. Откройте бота @helpdeskParkApp_bot');
        console.log('2. Отправьте /start');
        console.log('3. Нажмите кнопку меню');
        
    } catch (error) {
        console.error('\n💥 Ошибка при настройке:', error.message);
    }
}

// Запускаем настройку
setupMainWebApp();
