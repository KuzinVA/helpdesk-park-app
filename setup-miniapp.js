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

// Создаем команду /start с кнопкой для запуска мини-приложения
async function setupStartCommand() {
    try {
        console.log('🚀 Настраиваем команду /start...');
        
        // Создаем inline keyboard с кнопкой для запуска мини-приложения
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

        // Устанавливаем команду start
        await makeRequest('setMyCommands', {
            commands: [
                {
                    command: 'start',
                    description: 'Запустить Helpdesk Park'
                }
            ]
        });

        console.log('✅ Команда /start настроена');
        return keyboard;
    } catch (error) {
        console.error('❌ Ошибка при настройке команды start:', error.message);
        throw error;
    }
}

// Создаем обработчик для команды /start
async function createStartHandler() {
    try {
        console.log('📝 Создаем обработчик команды /start...');
        
        // Здесь будет логика для обработки команды /start
        // В реальном боте это делается через webhook или long polling
        
        console.log('✅ Обработчик команды /start создан');
    } catch (error) {
        console.error('❌ Ошибка при создании обработчика:', error.message);
    }
}

// Создаем меню команд
async function createMenuCommands() {
    try {
        console.log('🍔 Создаем меню команд...');
        
        const menuButton = {
            type: 'commands',
            text: 'Меню Helpdesk'
        };
        
        await makeRequest('setChatMenuButton', { menu_button: menuButton });
        console.log('✅ Меню команд создано');
    } catch (error) {
        console.error('❌ Ошибка при создании меню:', error.message);
    }
}

// Создаем команды для меню
async function setMenuCommands() {
    try {
        console.log('📋 Устанавливаем команды меню...');
        
        const commands = [
            {
                command: 'start',
                description: '🚀 Запустить Helpdesk Park'
            },
            {
                command: 'tickets',
                description: '📋 Просмотр заявок'
            },
            {
                command: 'create',
                description: '➕ Создать заявку'
            },
            {
                command: 'stats',
                description: '📊 Статистика'
            },
            {
                command: 'profile',
                description: '👤 Профиль'
            },
            {
                command: 'help',
                description: '❓ Помощь'
            }
        ];
        
        await makeRequest('setMyCommands', { commands });
        console.log('✅ Команды меню установлены');
    } catch (error) {
        console.error('❌ Ошибка при установке команд меню:', error.message);
    }
}

// Основная функция
async function setupMiniApp() {
    try {
        console.log('🚀 Настройка мини-приложения Helpdesk Park...\n');
        
        // Настраиваем команду /start
        const startKeyboard = await setupStartCommand();
        
        // Создаем обработчик
        await createStartHandler();
        
        // Создаем меню команд
        await createMenuCommands();
        
        // Устанавливаем команды меню
        await setMenuCommands();
        
        console.log('\n🎉 Настройка мини-приложения завершена успешно!');
        console.log('\n📱 Теперь вы можете:');
        console.log('1. Отправить /start боту');
        console.log('2. Нажать кнопку "🚀 Запустить Helpdesk Park"');
        console.log('3. Использовать команды в меню');
        
        console.log('\n🔗 Для тестирования:');
        console.log('1. Откройте бота в Telegram: @helpdeskParkApp_bot');
        console.log('2. Отправьте команду /start');
        console.log('3. Нажмите на кнопку запуска мини-приложения');
        console.log('4. Или используйте команды в меню');
        
        console.log('\n🌐 URL мини-приложения: http://localhost:3000');
        console.log('⚠️  Для продакшена замените на реальный URL');
        
    } catch (error) {
        console.error('\n💥 Ошибка при настройке мини-приложения:', error.message);
        process.exit(1);
    }
}

// Запускаем настройку
setupMiniApp();
