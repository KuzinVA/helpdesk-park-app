const TelegramBot = require('node-telegram-bot-api');

// Токен вашего бота
const token = '8465643840:AAEWFjl1h-EY3150NgihSG2HAaVYLci14Rk';
const bot = new TelegramBot(token, { polling: false });

async function setupBot() {
  try {
    console.log('🤖 Настройка Telegram бота для Mini App...');

    // 1. Установить команды бота
    await bot.setMyCommands([
      { command: 'start', description: '🚀 Запустить Helpdesk Park' },
      { command: 'help', description: '❓ Помощь' },
      { command: 'app', description: '📱 Открыть Mini App' },
      { command: 'tickets', description: '📋 Мои заявки' },
      { command: 'stats', description: '📊 Статистика' }
    ]);
    console.log('✅ Команды бота установлены');

    // 2. Установить кнопку меню для Mini App
    await bot.setChatMenuButton({
      type: 'web_app',
      text: '🚀 Helpdesk Park',
      web_app: { url: 'https://kuzinva.github.io/helpdesk-park-app/' }
    });
    console.log('✅ Кнопка меню установлена');

    // 3. Установить inline keyboard для команды /start
    const keyboard = {
      inline_keyboard: [
        [{
          text: '🚀 Запустить Helpdesk Park',
          web_app: { url: 'https://kuzinva.github.io/helpdesk-park-app/' }
        }],
        [{
          text: '📋 Мои заявки',
          callback_data: 'my_tickets'
        }],
        [{
          text: '📊 Статистика',
          callback_data: 'stats'
        }],
        [{
          text: '❓ Помощь',
          callback_data: 'help'
        }]
      ]
    };

    // 4. Обновить команду /start
    await bot.setMyCommands([
      { command: 'start', description: '🚀 Запустить приложение' },
      { command: 'help', description: '❓ Помощь' },
      { command: 'app', description: '📱 Открыть Mini App' },
      { command: 'tickets', description: '📋 Мои заявки' },
      { command: 'stats', description: '📊 Статистика' }
    ]);

    console.log('✅ Бот настроен для Mini App!');
    console.log('🌐 URL: https://kuzinva.github.io/helpdesk-park-app/');
    console.log('📱 Mini App теперь будет открываться как полноценное приложение!');
    console.log('');
    console.log('🔧 Что настроено:');
    console.log('   • Команды бота с описанием');
    console.log('   • Кнопка меню для запуска Mini App');
    console.log('   • Inline клавиатура с быстрым доступом');
    console.log('   • Правильный URL для GitHub Pages');
    console.log('');
    console.log('📱 Для тестирования:');
    console.log('   1. Найдите бота @helpdeskParkApp_bot');
    console.log('   2. Отправьте /start');
    console.log('   3. Нажмите "🚀 Запустить Helpdesk Park"');
    console.log('   4. Должен открыться полноценный Mini App');

  } catch (error) {
    console.error('❌ Ошибка настройки бота:', error.message);
    console.error('Детали ошибки:', error);
  }
}

setupBot();
