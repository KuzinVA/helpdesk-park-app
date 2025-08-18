#!/usr/bin/env node

// Примеры использования MCP инструментов для Telegram Mini App
// Этот файл демонстрирует, как использовать различные MCP инструменты

// Пример 1: Отправка простого сообщения
const sendSimpleMessage = {
  name: 'send_telegram_message',
  arguments: {
    chat_id: '@helpdesk_chat',
    message: '🔔 <b>Новое уведомление</b>\n\nСистема работает в штатном режиме.',
    parse_mode: 'HTML'
  }
};

// Пример 2: Создание inline клавиатуры
const createKeyboard = {
  name: 'create_inline_keyboard',
  arguments: {
    buttons: [
      {
        text: '📊 Статистика',
        callback_data: 'show_stats'
      },
      {
        text: '📝 Создать заявку',
        web_app: {
          url: 'https://your-app.com/create-ticket'
        }
      },
      {
        text: '🔍 Поиск',
        callback_data: 'search_tickets'
      }
    ],
    rows: 2
  }
};

// Пример 3: Отправка уведомления о заявке
const sendTicketNotification = {
  name: 'send_ticket_notification',
  arguments: {
    chat_id: '@support_team',
    ticket: {
      id: 'ticket_123456',
      title: 'Проблема с доступом к системе',
      status: 'ASSIGNED',
      priority: 'HIGH',
      service: { name: 'IT Support' },
      location: { name: 'Главный офис' }
    },
    notification_type: 'ASSIGNED'
  }
};

// Пример 4: Получение информации о чате
const getChatInfo = {
  name: 'get_chat_info',
  arguments: {
    chat_id: '@helpdesk_chat'
  }
};

// Пример 5: Установка webhook
const setWebhook = {
  name: 'set_webhook',
  arguments: {
    url: 'https://your-domain.com/webhook/telegram'
  }
};

// Пример 6: Получение информации о боте
const getBotInfo = {
  name: 'get_bot_info',
  arguments: {}
};

// Пример 7: Отправка сообщения с клавиатурой
const sendMessageWithKeyboard = {
  name: 'send_telegram_message',
  arguments: {
    chat_id: '@helpdesk_chat',
    message: '🎯 <b>Выберите действие:</b>',
    parse_mode: 'HTML',
    keyboard: {
      inline_keyboard: [
        [
          {
            text: '📊 Открыть статистику',
            web_app: {
              url: 'https://your-app.com/stats'
            }
          }
        ],
        [
          {
            text: '📝 Новая заявка',
            web_app: {
              url: 'https://your-app.com/create'
            }
          },
          {
            text: '🔍 Поиск заявок',
            web_app: {
              url: 'https://your-app.com/search'
            }
          }
        ]
      ]
    }
  }
};

// Пример 8: Отправка SLA предупреждения
const sendSLAWarning = {
  name: 'send_ticket_notification',
  arguments: {
    chat_id: '@support_team',
    ticket: {
      id: 'ticket_789012',
      title: 'Критическая ошибка в системе',
      status: 'IN_PROGRESS',
      priority: 'CRITICAL',
      service: { name: 'System Admin' },
      location: { name: 'Data Center' }
    },
    notification_type: 'SLA_WARNING'
  }
};

// Пример 9: Получение участников чата
const getChatMembers = {
  name: 'get_chat_members',
  arguments: {
    chat_id: '@helpdesk_chat'
  }
};

// Пример 10: Удаление webhook
const deleteWebhook = {
  name: 'delete_webhook',
  arguments: {}
};

// Пример 11: Получение информации о webhook
const getWebhookInfo = {
  name: 'get_webhook_info',
  arguments: {}
};

// Пример 12: Отправка сообщения о комментарии
const sendCommentNotification = {
  name: 'send_ticket_notification',
  arguments: {
    chat_id: '@support_team',
    ticket: {
      id: 'ticket_345678',
      title: 'Обновление программного обеспечения',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      service: { name: 'IT Support' },
      location: { name: 'Отдел разработки' }
    },
    notification_type: 'COMMENT_ADDED'
  }
};

// Функция для демонстрации использования
function demonstrateMCPUsage() {
  console.log('🚀 Примеры использования MCP инструментов для Telegram Mini App\n');
  
  console.log('1. Отправка простого сообщения:');
  console.log(JSON.stringify(sendSimpleMessage, null, 2));
  
  console.log('\n2. Создание inline клавиатуры:');
  console.log(JSON.stringify(createKeyboard, null, 2));
  
  console.log('\n3. Отправка уведомления о заявке:');
  console.log(JSON.stringify(sendTicketNotification, null, 2));
  
  console.log('\n4. Получение информации о чате:');
  console.log(JSON.stringify(getChatInfo, null, 2));
  
  console.log('\n5. Установка webhook:');
  console.log(JSON.stringify(setWebhook, null, 2));
  
  console.log('\n6. Получение информации о боте:');
  console.log(JSON.stringify(getBotInfo, null, 2));
  
  console.log('\n7. Отправка сообщения с клавиатурой:');
  console.log(JSON.stringify(sendMessageWithKeyboard, null, 2));
  
  console.log('\n8. Отправка SLA предупреждения:');
  console.log(JSON.stringify(sendSLAWarning, null, 2));
  
  console.log('\n9. Получение участников чата:');
  console.log(JSON.stringify(getChatMembers, null, 2));
  
  console.log('\n10. Удаление webhook:');
  console.log(JSON.stringify(deleteWebhook, null, 2));
  
  console.log('\n11. Получение информации о webhook:');
  console.log(JSON.stringify(getWebhookInfo, null, 2));
  
  console.log('\n12. Отправка уведомления о комментарии:');
  console.log(JSON.stringify(sendCommentNotification, null, 2));
  
  console.log('\n📚 Для использования этих инструментов:');
  console.log('1. Установите зависимости: npm install');
  console.log('2. Настройте переменные окружения');
  console.log('3. Запустите MCP сервер: npm start');
  console.log('4. Подключите MCP клиент к серверу');
}

// Запуск демонстрации, если файл запущен напрямую
if (import.meta.url === `file://${process.argv[1]}`) {
  demonstrateMCPUsage();
}

export {
  sendSimpleMessage,
  createKeyboard,
  sendTicketNotification,
  getChatInfo,
  setWebhook,
  getBotInfo,
  sendMessageWithKeyboard,
  sendSLAWarning,
  getChatMembers,
  deleteWebhook,
  getWebhookInfo,
  sendCommentNotification
};
