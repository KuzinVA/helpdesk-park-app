const TelegramBot = require('node-telegram-bot-api');

// Токен вашего бота
const token = '8465643840:AAEWFjl1h-EY3150NgihSG2HAaVYLci14Rk';
const bot = new TelegramBot(token, { polling: false });

async function setupFinalBot() {
  try {
    console.log('🤖 Финальная настройка Telegram бота для Mini App...');
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

    // 3. Проверить текущие настройки бота
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
    console.log('');
    console.log('⚠️  ВАЖНО: Для полной настройки Mini App:');
    console.log('   1. Откройте @BotFather');
    console.log('   2. Отправьте /setmenubutton');
    console.log('   3. Выберите @helpdeskParkApp_bot');
    console.log('   4. Введите текст: 🚀 Helpdesk Park');
    console.log('   5. Введите URL: https://kuzinva.github.io/helpdesk-park-app/');

  } catch (error) {
    console.error('❌ Ошибка настройки бота:', error.message);
    console.error('Детали ошибки:', error);
    
    if (error.response) {
      console.error('Ответ API:', error.response.data);
    }
  }
}

// Запуск финальной настройки
setupFinalBot();
