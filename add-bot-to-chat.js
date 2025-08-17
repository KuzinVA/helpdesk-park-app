const https = require('https');

const BOT_TOKEN = '8465643840:AAEWFjl1h-EY3150NgihSG2HAaVYLci14Rk';
const BOT_USERNAME = 'helpdeskParkApp_bot';

console.log('🤖 Скрипт для добавления бота в чат...');
console.log(`🔑 Токен: ${BOT_TOKEN.substring(0, 10)}...`);
console.log(`👤 Бот: @${BOT_USERNAME}`);

console.log('\n📋 Инструкции по добавлению бота в чат:');
console.log('1. Откройте чат: https://t.me/+grmdzW2hrEUyN2Qy');
console.log('2. Нажмите на название чата вверху');
console.log('3. Выберите "Добавить участников" или "Add members"');
console.log('4. Найдите бота @helpdeskParkApp_bot');
console.log('5. Добавьте его в чат');
console.log('6. Дайте боту права администратора (Admin)');
console.log('7. Включите права: "Удалять сообщения", "Заблокировать пользователей"');

console.log('\n🔧 После добавления бота:');
console.log('1. Запустите Chat API: node chat-api.js');
console.log('2. Протестируйте API: curl "http://localhost:3001/api/chat-members?chat_id=НАЙДЕННЫЙ_ID"');
console.log('3. Используйте найденный Chat ID в мини-приложении');

console.log('\n💡 Альтернативный способ:');
console.log('1. Отправьте боту @helpdeskParkApp_bot команду /start');
console.log('2. Нажмите кнопку "🚀 Запустить Helpdesk Park"');
console.log('3. В мини-приложении перейдите на страницу "Участники чата"');
console.log('4. Введите Chat ID в форму для тестирования');

console.log('\n🎯 Ожидаемый результат:');
console.log('- Бот будет добавлен в чат');
console.log('- API сможет получать участников чата');
console.log('- Мини-приложение будет загружать реальных участников');
console.log('- Система уведомлений будет работать корректно');

console.log('\n⚠️ Важно:');
console.log('- Бот должен быть администратором чата');
console.log('- У бота должны быть права на чтение сообщений');
console.log('- Chat ID может отличаться от ожидаемого');
console.log('- После добавления бота подождите несколько минут');

console.log('\n🚀 Готово к тестированию!');
