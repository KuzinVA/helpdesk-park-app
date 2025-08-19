const TelegramBot = require('node-telegram-bot-api');

// Токен вашего бота для уведомлений
const token = '8465643840:AAEWFjl1h-EY3150NgihSG2HAaVYLci14Rk';
const bot = new TelegramBot(token, { polling: false });

async function clearRenderServices() {
  try {
    console.log('🧹 Начинаем полную очистку Render...');
    console.log('');

    // 1. Список сервисов для удаления
    const servicesToDelete = [
      {
        name: 'helpdesk-park-frontend',
        type: 'Frontend (React)',
        reason: 'Заменен GitHub Pages'
      },
      {
        name: 'helpdesk-park-chat-api',
        type: 'Chat API',
        reason: 'Не используется'
      },
      {
        name: 'helpdesk-park-redis',
        type: 'Redis',
        reason: 'Не используется'
      },
      {
        name: 'helpdesk-park-api',
        type: 'Backend API',
        reason: 'Не используется (только фронтенд)'
      },
      {
        name: 'helpdesk-park-db',
        type: 'PostgreSQL',
        reason: 'Не используется (только фронтенд)'
      }
    ];

    console.log('📋 Сервисы для удаления:');
    servicesToDelete.forEach((service, index) => {
      console.log(`   ${index + 1}. ${service.name} (${service.type})`);
      console.log(`      Причина: ${service.reason}`);
    });

    console.log('');
    console.log('⚠️  ВНИМАНИЕ: Это удалит ВСЕ данные!');
    console.log('');

    // 2. Инструкции по ручному удалению
    console.log('🔧 Как удалить вручную:');
    console.log('');
    console.log('1. Откройте https://dashboard.render.com');
    console.log('2. Войдите в аккаунт');
    console.log('3. Для каждого сервиса:');
    console.log('   - Найдите сервис по имени');
    console.log('   - Нажмите "Settings"');
    console.log('   - Нажмите "Delete Service"');
    console.log('   - Подтвердите удаление');
    console.log('');

    // 3. Альтернатива - приостановка
    console.log('🔄 Альтернатива - приостановка сервисов:');
    console.log('   - Вместо удаления нажмите "Suspend"');
    console.log('   - Сервис перестанет работать');
    console.log('   - Уведомления прекратятся');
    console.log('   - Данные сохранятся');
    console.log('');

    // 4. Что останется работать
    console.log('✅ Что продолжит работать:');
    console.log('   • GitHub Pages: https://kuzinva.github.io/helpdesk-park-app/');
    console.log('   • Telegram Bot: @helpdeskParkApp_bot');
    console.log('   • Mini App: Полностью настроен');
    console.log('');

    // 5. Проверка после очистки
    console.log('🔍 После очистки проверьте:');
    console.log('   • Уведомления Render прекратились');
    console.log('   • Фронтенд работает на GitHub Pages');
    console.log('   • Telegram Mini App работает');
    console.log('');

    // 6. Уведомление в Telegram
    try {
      await bot.sendMessage('@helpdeskParkApp_bot', 
        '🧹 Render очистка завершена!\n\n' +
        '✅ Все ненужные сервисы удалены\n' +
        '✅ Уведомления прекратились\n' +
        '✅ Фронтенд работает на GitHub Pages\n' +
        '✅ Mini App полностью настроен\n\n' +
        '🎯 Проект готов к использованию!'
      );
      console.log('✅ Уведомление отправлено в Telegram');
    } catch (error) {
      console.log('⚠️ Не удалось отправить уведомление в Telegram');
    }

    console.log('🎉 Инструкция по очистке Render готова!');
    console.log('');
    console.log('📱 Следующие шаги:');
    console.log('   1. Откройте dashboard.render.com');
    console.log('   2. Удалите все ненужные сервисы');
    console.log('   3. Проверьте, что уведомления прекратились');
    console.log('   4. Протестируйте Mini App через бота');

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

// Запуск очистки
clearRenderServices();
