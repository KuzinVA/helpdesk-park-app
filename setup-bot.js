const https = require('https');

const BOT_TOKEN = '8465643840:AAEWFjl1h-EY3150NgihSG2HAaVYLci14Rk';
const BOT_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

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

// Получаем информацию о боте
async function getBotInfo() {
    try {
        console.log('🤖 Получаем информацию о боте...');
        const botInfo = await makeRequest('getMe');
        console.log('✅ Информация о боте:');
        console.log(`   Имя: ${botInfo.first_name}`);
        console.log(`   Username: @${botInfo.username}`);
        console.log(`   ID: ${botInfo.id}`);
        console.log(`   Может присоединяться к группам: ${botInfo.can_join_groups ? 'Да' : 'Нет'}`);
        console.log(`   Может читать сообщения: ${botInfo.can_read_all_group_messages ? 'Да' : 'Нет'}`);
        console.log(`   Поддерживает inline режим: ${botInfo.supports_inline_queries ? 'Да' : 'Нет'}`);
        return botInfo;
    } catch (error) {
        console.error('❌ Ошибка при получении информации о боте:', error.message);
        throw error;
    }
}

// Устанавливаем команды бота
async function setBotCommands() {
    try {
        console.log('\n📝 Устанавливаем команды бота...');
        const commands = [
            {
                command: 'start',
                description: 'Запустить Helpdesk Park'
            },
            {
                command: 'help',
                description: 'Показать справку'
            },
            {
                command: 'tickets',
                description: 'Просмотр заявок'
            },
            {
                command: 'create',
                description: 'Создать новую заявку'
            },
            {
                command: 'stats',
                description: 'Статистика заявок'
            }
        ];

        await makeRequest('setMyCommands', { commands });
        console.log('✅ Команды бота установлены');
    } catch (error) {
        console.error('❌ Ошибка при установке команд:', error.message);
    }
}

// Устанавливаем описание бота
async function setBotDescription() {
    try {
        console.log('\n📖 Устанавливаем описание бота...');
        const description = `🚀 Helpdesk Park - Система управления заявками парка аттракционов

Создавайте, отслеживайте и управляйте заявками прямо в Telegram!

Основные возможности:
• 📋 Просмотр всех заявок
• ➕ Создание новых заявок
• 📊 Статистика и аналитика
• 👤 Управление профилем
• 🔔 Уведомления о статусе

Используйте команду /start для запуска приложения!`;
        
        await makeRequest('setMyDescription', { description });
        console.log('✅ Описание бота установлено');
    } catch (error) {
        console.error('❌ Ошибка при установке описания:', error.message);
    }
}

// Устанавливаем краткое описание бота
async function setBotShortDescription() {
    try {
        console.log('\n💬 Устанавливаем краткое описание бота...');
        const shortDescription = '🚀 Система управления заявками парка аттракционов';
        
        await makeRequest('setMyShortDescription', { short_description: shortDescription });
        console.log('✅ Краткое описание бота установлено');
    } catch (error) {
        console.error('❌ Ошибка при установке краткого описания:', error.message);
    }
}

// Создаем меню команд для мини-приложения
async function createMenuButton() {
    try {
        console.log('\n🍔 Создаем меню команд...');
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

// Основная функция
async function setupBot() {
    try {
        console.log('🚀 Настройка Telegram бота Helpdesk Park...\n');
        
        // Получаем информацию о боте
        await getBotInfo();
        
        // Устанавливаем команды
        await setBotCommands();
        
        // Устанавливаем описания
        await setBotDescription();
        await setBotShortDescription();
        
        // Создаем меню
        await createMenuButton();
        
        console.log('\n🎉 Настройка бота завершена успешно!');
        console.log('\n📱 Теперь вы можете:');
        console.log('1. Отправить /start боту для запуска');
        console.log('2. Использовать команды в меню');
        console.log('3. Тестировать мини-приложение');
        
        console.log('\n🔗 Для тестирования мини-приложения:');
        console.log('1. Откройте бота в Telegram');
        console.log('2. Отправьте команду /start');
        console.log('3. Нажмите на кнопку "Меню Helpdesk"');
        
    } catch (error) {
        console.error('\n💥 Ошибка при настройке бота:', error.message);
        process.exit(1);
    }
}

// Запускаем настройку
setupBot();
