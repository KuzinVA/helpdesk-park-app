const TelegramBot = require('node-telegram-bot-api');

// Токен вашего бота
const token = '8465643840:AAEWFjl1h-EY3150NgihSG2HAaVYLci14Rk';
const bot = new TelegramBot(token, { polling: false });

async function setupBot() {
  try {
    console.log('🤖 Настройка Telegram бота...');

    // 1. Установить команды бота
    await bot.setMyCommands([
      { command: 'start', description: '🚀 Запустить приложение' },
      { command: 'help', description: '❓ Помощь' },
      { command: 'app', description: '📱 Открыть Mini App' }
    ]);
    console.log('✅ Команды бота установлены');

    // 2. Установить кнопку меню для Mini App
    await bot.setChatMenuButton({
      type: 'web_app',
      text: '🚀 Запустить Helpdesk Park',
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
      { command: 'app', description: '📱 Открыть Mini App' }
    ]);

    console.log('✅ Бот настроен!');
    console.log('🌐 Новый URL: https://kuzinva.github.io/helpdesk-park-app/');
    console.log('📱 Mini App теперь будет открываться с новым дизайном!');

  } catch (error) {
    console.error('❌ Ошибка настройки бота:', error.message);
  }
}

setupBot();
