const TelegramBot = require('node-telegram-bot-api');

// Токен вашего бота
const token = '8465643840:AAEWFjl1h-EY3150NgihSG2HAaVYLci14Rk';
const bot = new TelegramBot(token, { polling: true });

// URL Mini App
const MINI_APP_URL = 'https://kuzinva.github.io/helpdesk-park-app/';

console.log('🤖 Запуск простого бота для тестирования...');

// Обработчик команды /start
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.first_name;
  
  console.log(`👤 Пользователь ${username} (${chatId}) отправил /start`);
  
  const message = `👋 Привет, ${username}!

🎠 Добро пожаловать в **Helpdesk Park**!

🚀 Нажмите кнопку ниже, чтобы открыть приложение:`;

  const keyboard = {
    inline_keyboard: [
      [
        {
          text: '🚀 Запустить Helpdesk Park',
          web_app: { url: MINI_APP_URL }
        }
      ]
    ]
  };

  try {
    await bot.sendMessage(chatId, message, {
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });
    console.log(`✅ Сообщение отправлено пользователю ${username}`);
  } catch (error) {
    console.error(`❌ Ошибка отправки сообщения:`, error.message);
  }
});

// Обработчик команды /test
bot.onText(/\/test/, async (msg) => {
  const chatId = msg.chat.id;
  
  console.log(`🧪 Тест от пользователя ${chatId}`);
  
  const message = `🧪 **Тест бота**

✅ Бот работает!
🌐 URL: ${MINI_APP_URL}

Попробуйте команду /start для запуска приложения`;

  try {
    await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    console.log(`✅ Тест отправлен пользователю ${chatId}`);
  } catch (error) {
    console.error(`❌ Ошибка теста:`, error.message);
  }
});

// Обработчик всех сообщений (для отладки)
bot.on('message', (msg) => {
  if (!msg.text || msg.text.startsWith('/')) return; // Пропускаем команды
  
  const chatId = msg.chat.id;
  const username = msg.from.first_name;
  const text = msg.text;
  
  console.log(`💬 Сообщение от ${username} (${chatId}): "${text}"`);
  
  // Отвечаем на любое текстовое сообщение
  bot.sendMessage(chatId, `📝 Вы написали: "${text}"

🚀 Используйте команду /start для запуска приложения!`);
});

// Обработка ошибок
bot.on('error', (error) => {
  console.error('❌ Ошибка бота:', error);
});

bot.on('polling_error', (error) => {
  console.error('❌ Ошибка polling:', error);
});

console.log('✅ Бот запущен!');
console.log('🌐 Mini App URL:', MINI_APP_URL);
console.log('');
console.log('📱 Теперь бот будет отвечать на сообщения');
console.log('🔧 Для остановки нажмите Ctrl+C');
console.log('');
console.log('🧪 Команды для тестирования:');
console.log('   /start - Запустить приложение');
console.log('   /test - Проверить работу бота');
console.log('   Любой текст - получить ответ');
