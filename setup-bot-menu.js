const TelegramBot = require('node-telegram-bot-api');

// Токен вашего бота
const token = '8465643840:AAEWFjl1h-EY3150NgihSG2HAaVYLci14Rk';
const bot = new TelegramBot(token, { polling: true }); // Включаем polling для обработки сообщений

// URL Mini App
const MINI_APP_URL = 'https://kuzinva.github.io/helpdesk-park-app/';

async function setupBotWithMenu() {
  try {
    console.log('🤖 Настройка Telegram бота с меню для Mini App...');
    console.log('');

    // 1. Установить команды бота
    const commands = [
      { command: 'start', description: '🚀 Запустить Helpdesk Park' },
      { command: 'help', description: '❓ Помощь и инструкции' },
      { command: 'app', description: '📱 Открыть Mini App' },
      { command: 'menu', description: '📋 Показать меню' }
    ];

    await bot.setMyCommands(commands);
    console.log('✅ Команды бота установлены:');
    commands.forEach(cmd => {
      console.log(`   • /${cmd.command} - ${cmd.description}`);
    });

    // 2. Установить кнопку меню для Mini App
    try {
      await bot.setChatMenuButton({
        type: 'web_app',
        text: '🚀 Helpdesk Park',
        web_app: { url: MINI_APP_URL }
      });
      console.log('✅ Кнопка меню установлена: 🚀 Helpdesk Park');
    } catch (error) {
      console.log('⚠️ Не удалось установить кнопку меню:', error.message);
    }

    // 3. Проверить текущие настройки бота
    try {
      const botInfo = await bot.getMe();
      console.log('✅ Информация о боте получена:');
      console.log(`   • Имя: ${botInfo.first_name}`);
      console.log(`   • Username: @${botInfo.username}`);
      console.log(`   • ID: ${botInfo.id}`);
    } catch (error) {
      console.log('⚠️ Не удалось получить информацию о боте');
    }

    console.log('');
    console.log('🎉 Бот настроен и готов к работе!');
    console.log('🌐 URL Mini App:', MINI_APP_URL);
    console.log('');

  } catch (error) {
    console.error('❌ Ошибка настройки бота:', error.message);
  }
}

// Обработчики команд
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.first_name;
  
  const welcomeMessage = `👋 Привет, ${username}!

🎠 Добро пожаловать в **Helpdesk Park** - систему управления заявками парка аттракционов!

🚀 **Что умеет бот:**
• Создавать и отслеживать заявки
• Управлять задачами
• Просматривать статистику
• Получать уведомления

📱 **Как использовать:**
1. Нажмите кнопку "🚀 Запустить Helpdesk Park" ниже
2. Или используйте команду /menu для доступа к функциям

🎯 **Быстрый старт:**
Нажмите кнопку ниже, чтобы открыть приложение!`;

  const keyboard = {
    inline_keyboard: [
      [
        {
          text: '🚀 Запустить Helpdesk Park',
          web_app: { url: MINI_APP_URL }
        }
      ],
      [
        { text: '📋 Мои заявки', callback_data: 'my_tickets' },
        { text: '➕ Создать заявку', callback_data: 'create_ticket' }
      ],
      [
        { text: '📊 Статистика', callback_data: 'stats' },
        { text: '👤 Профиль', callback_data: 'profile' }
      ],
      [
        { text: '❓ Помощь', callback_data: 'help' }
      ]
    ]
  };

  await bot.sendMessage(chatId, welcomeMessage, {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  });
});

bot.onText(/\/help/, async (msg) => {
  const chatId = msg.chat.id;
  
  const helpMessage = `❓ **Помощь по использованию Helpdesk Park**

🚀 **Основные команды:**
• /start - Запустить приложение
• /menu - Показать главное меню
• /help - Показать эту справку

📱 **Как открыть Mini App:**
1. Нажмите кнопку "🚀 Запустить Helpdesk Park"
2. Или используйте команду /menu

🎯 **Функции приложения:**
• 📋 Управление заявками
• ➕ Создание новых задач
• 📊 Просмотр статистики
• 👤 Управление профилем
• 🔔 Получение уведомлений

🌐 **Ссылка на приложение:**
${MINI_APP_URL}

💡 **Совет:** Используйте кнопки меню для быстрого доступа к функциям!`;

  const keyboard = {
    inline_keyboard: [
      [
        {
          text: '🚀 Запустить Helpdesk Park',
          web_app: { url: MINI_APP_URL }
        }
      ],
      [
        { text: '📋 Мои заявки', callback_data: 'my_tickets' },
        { text: '➕ Создать заявку', callback_data: 'create_ticket' }
      ],
      [
        { text: '📊 Статистика', callback_data: 'stats' },
        { text: '👤 Профиль', callback_data: 'profile' }
      ]
    ]
  };

  await bot.sendMessage(chatId, helpMessage, {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  });
});

bot.onText(/\/menu/, async (msg) => {
  const chatId = msg.chat.id;
  
  const menuMessage = `📋 **Главное меню Helpdesk Park**

Выберите нужную функцию:`;

  const keyboard = {
    inline_keyboard: [
      [
        {
          text: '🚀 Запустить Helpdesk Park',
          web_app: { url: MINI_APP_URL }
        }
      ],
      [
        { text: '📋 Мои заявки', callback_data: 'my_tickets' },
        { text: '➕ Создать заявку', callback_data: 'create_ticket' }
      ],
      [
        { text: '📊 Статистика', callback_data: 'stats' },
        { text: '👤 Профиль', callback_data: 'profile' }
      ],
      [
        { text: '❓ Помощь', callback_data: 'help' }
      ]
    ]
  };

  await bot.sendMessage(chatId, menuMessage, {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  });
});

bot.onText(/\/app/, async (msg) => {
  const chatId = msg.chat.id;
  
  const appMessage = `📱 **Открытие Helpdesk Park Mini App**

Нажмите кнопку ниже, чтобы открыть приложение:`;

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

  await bot.sendMessage(chatId, appMessage, {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  });
});

// Обработчики callback кнопок
bot.on('callback_query', async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  switch (data) {
    case 'my_tickets':
      await bot.sendMessage(chatId, '📋 **Мои заявки**\n\nДля просмотра заявок откройте приложение:', {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🚀 Открыть приложение',
                web_app: { url: MINI_APP_URL }
              }
            ]
          ]
        }
      });
      break;

    case 'create_ticket':
      await bot.sendMessage(chatId, '➕ **Создание заявки**\n\nДля создания новой заявки откройте приложение:', {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🚀 Открыть приложение',
                web_app: { url: MINI_APP_URL }
              }
            ]
          ]
        }
      });
      break;

    case 'stats':
      await bot.sendMessage(chatId, '📊 **Статистика**\n\nДля просмотра статистики откройте приложение:', {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🚀 Открыть приложение',
                web_app: { url: MINI_APP_URL }
              }
            ]
          ]
        }
      });
      break;

    case 'profile':
      await bot.sendMessage(chatId, '👤 **Профиль**\n\nДля управления профилем откройте приложение:', {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🚀 Открыть приложение',
                web_app: { url: MINI_APP_URL }
              }
            ]
          ]
        }
      });
      break;

    case 'help':
      await bot.sendMessage(chatId, '❓ **Помощь**\n\nДля получения помощи используйте команду /help или откройте приложение:', {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🚀 Открыть приложение',
                web_app: { url: MINI_APP_URL }
              }
            ]
          ]
        }
      });
      break;
  }

  // Отвечаем на callback query
  await bot.answerCallbackQuery(callbackQuery.id);
});

// Обработка ошибок
bot.on('error', (error) => {
  console.error('❌ Ошибка бота:', error);
});

bot.on('polling_error', (error) => {
  console.error('❌ Ошибка polling:', error);
});

// Запуск настройки и бота
console.log('🚀 Запуск бота...');
setupBotWithMenu().then(() => {
  console.log('✅ Бот запущен и готов к работе!');
  console.log('📱 Теперь бот будет отвечать на сообщения и команды');
  console.log('🌐 Mini App URL:', MINI_APP_URL);
  console.log('');
  console.log('🔧 Для остановки бота нажмите Ctrl+C');
}).catch(error => {
  console.error('❌ Ошибка запуска бота:', error);
});
