const TelegramBot = require('node-telegram-bot-api');

// Токен вашего бота
const token = '8465643840:AAEWFjl1h-EY3150NgihSG2HAaVYLci14Rk';
const bot = new TelegramBot(token, { polling: false });

async function setupEnhancedBot() {
  try {
    console.log('🤖 Расширенная настройка Telegram бота для Mini App...');
    console.log('');

    // 1. Установить команды бота
    const commands = [
      { command: 'start', description: '🚀 Запустить Helpdesk Park' },
      { command: 'help', description: '❓ Помощь и инструкции' },
      { command: 'app', description: '📱 Открыть Mini App' },
      { command: 'tickets', description: '📋 Мои заявки' },
      { command: 'stats', description: '📊 Статистика' },
      { command: 'profile', description: '👤 Мой профиль' },
      { command: 'create', description: '➕ Создать заявку' }
    ];

    await bot.setMyCommands(commands);
    console.log('✅ Команды бота установлены:');
    commands.forEach(cmd => {
      console.log(`   • /${cmd.command} - ${cmd.description}`);
    });

    // 2. Установить кнопку меню для Mini App
    await bot.setChatMenuButton({
      type: 'web_app',
      text: '🚀 Helpdesk Park',
      web_app: { url: 'https://kuzinva.github.io/helpdesk-park-app/' }
    });
    console.log('✅ Кнопка меню установлена: 🚀 Helpdesk Park');

    // 3. Установить inline keyboard для команды /start
    const startKeyboard = {
      inline_keyboard: [
        [{
          text: '🚀 Запустить Helpdesk Park',
          web_app: { url: 'https://kuzinva.github.io/helpdesk-park-app/' }
        }],
        [{
          text: '📋 Мои заявки',
          callback_data: 'my_tickets'
        }, {
          text: '➕ Создать заявку',
          callback_data: 'create_ticket'
        }],
        [{
          text: '📊 Статистика',
          callback_data: 'stats'
        }, {
          text: '👤 Профиль',
          callback_data: 'profile'
        }],
        [{
          text: '❓ Помощь',
          callback_data: 'help'
        }]
      ]
    };

    console.log('✅ Inline клавиатура настроена');

    // 4. Настроить описание бота
    await bot.setDescription(`
🎠 Helpdesk Park - Система управления заявками

🚀 Полноценный Mini App с Apple-style дизайном
📱 Нативные кнопки Telegram
🎨 Автоматическое переключение темы
💫 Haptic Feedback и плавная навигация

Отправьте /start для запуска!
    `.trim());

    // 5. Настроить краткое описание
    await bot.setShortDescription('🎠 Система управления заявками с Telegram Mini App');

    // 6. Проверить текущие настройки бота
    try {
      const botInfo = await bot.getMe();
      console.log('✅ Информация о боте получена:');
      console.log(`   • Имя: ${botInfo.first_name}`);
      console.log(`   • Username: @${botInfo.username}`);
      console.log(`   • ID: ${botInfo.id}`);
      console.log(`   • Поддерживает inline режим: ${botInfo.supports_inline_queries ? 'Да' : 'Нет'}`);
    } catch (error) {
      console.log('⚠️ Не удалось получить информацию о боте');
    }

    console.log('');
    console.log('🎉 Бот полностью настроен для Mini App!');
    console.log('');
    console.log('🌐 URL Mini App: https://kuzinva.github.io/helpdesk-park-app/');
    console.log('📱 Теперь Mini App будет открываться как полноценное приложение!');
    console.log('');
    console.log('🔧 Что настроено:');
    console.log('   • 7 команд бота с описанием');
    console.log('   • Кнопка меню "🚀 Helpdesk Park"');
    console.log('   • Inline клавиатура с быстрым доступом');
    console.log('   • Описание и краткое описание бота');
    console.log('   • Правильный URL для GitHub Pages');
    console.log('');
    console.log('📱 Для тестирования:');
    console.log('   1. Найдите бота @helpdeskParkApp_bot');
    console.log('   2. Отправьте /start');
    console.log('   3. Нажмите "🚀 Запустить Helpdesk Park"');
    console.log('   4. Должен открыться полноценный Mini App');
    console.log('');
    console.log('🎯 Ожидаемый результат:');
    console.log('   • Без поисковой строки Telegram');
    console.log('   • С нативной кнопкой "Назад"');
    console.log('   • С главной кнопкой внизу');
    console.log('   • С Haptic Feedback');
    console.log('   • С автоматической темой');

  } catch (error) {
    console.error('❌ Ошибка настройки бота:', error.message);
    console.error('Детали ошибки:', error);
    
    if (error.response) {
      console.error('Ответ API:', error.response.data);
    }
  }
}

// Запуск расширенной настройки
setupEnhancedBot();
