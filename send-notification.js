const https = require('https');

const BOT_TOKEN = '8465643840:AAEWFjl1h-EY3150NgihSG2HAaVYLci14Rk';

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

// Отправить уведомление пользователю
async function sendNotification(userId, message, parseMode = 'HTML') {
    try {
        console.log(`📤 Отправляем уведомление пользователю ${userId}...`);
        const result = await makeRequest('sendMessage', {
            chat_id: userId,
            text: message,
            parse_mode: parseMode,
            disable_web_page_preview: true
        });
        
        console.log('✅ Уведомление отправлено успешно');
        return result;
    } catch (error) {
        console.error(`❌ Ошибка отправки уведомления: ${error.message}`);
        return null;
    }
}

// Отправить уведомление о назначении на заявку
async function sendAssignmentNotification(assigneeId, ticketData) {
    const message = `🔔 <b>Новая задача назначена на вас!</b>

📋 <b>Заявка:</b> ${ticketData.title}
📝 <b>Описание:</b> ${ticketData.description}
🏷️ <b>Категория:</b> ${getCategoryText(ticketData.category)}
⚡ <b>Приоритет:</b> ${getPriorityText(ticketData.priority)}
👤 <b>Создатель:</b> ${ticketData.createdBy}
📅 <b>Создано:</b> ${formatDate(ticketData.createdAt)}

💡 <i>Заявка требует вашего внимания. Не забудьте обновить статус!</i>`;

    return await sendNotification(assigneeId, message);
}

// Отправить уведомление об изменении статуса заявки
async function sendStatusUpdateNotification(assigneeId, ticketData, newStatus) {
    const message = `🔄 <b>Статус заявки обновлен!</b>

📋 <b>Заявка:</b> ${ticketData.title}
🆕 <b>Новый статус:</b> ${getStatusText(newStatus)}
👤 <b>Обновил:</b> ${ticketData.updatedBy || 'Система'}
📅 <b>Обновлено:</b> ${formatDate(ticketData.updatedAt)}

💡 <i>Проверьте текущий статус заявки</i>`;

    return await sendNotification(assigneeId, message);
}

// Отправить уведомление о комментарии к заявке
async function sendCommentNotification(assigneeId, ticketData, comment, commentAuthor) {
    const message = `💬 <b>Новый комментарий к заявке!</b>

📋 <b>Заявка:</b> ${ticketData.title}
💭 <b>Комментарий:</b> ${comment}
👤 <b>Автор:</b> ${commentAuthor}
📅 <b>Добавлен:</b> ${formatDate(new Date())}

💡 <i>Проверьте новый комментарий</i>`;

    return await sendNotification(assigneeId, message);
}

// Утилиты для форматирования
function getStatusText(status) {
    const statusMap = {
        'new': '🆕 Новый',
        'in-progress': '🔄 В работе',
        'resolved': '✅ Решено',
        'closed': '🔒 Закрыто'
    };
    return statusMap[status] || status;
}

function getPriorityText(priority) {
    const priorityMap = {
        'low': '🟢 Низкий',
        'medium': '🟡 Средний',
        'high': '🟠 Высокий',
        'critical': '🔴 Критический'
    };
    return priorityMap[priority] || priority;
}

function getCategoryText(category) {
    const categoryMap = {
        'technical': '🔧 Техподдержка',
        'billing': '💰 Биллинг',
        'feature': '✨ Новый функционал',
        'bug': '🐛 Ошибка',
        'other': '📝 Другое'
    };
    return categoryMap[category] || category;
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Тестирование функций
async function testNotifications() {
    console.log('🧪 Тестирование системы уведомлений...\n');
    
    const testTicket = {
        title: 'Тестовая заявка',
        description: 'Это тестовая заявка для проверки уведомлений',
        category: 'technical',
        priority: 'high',
        createdBy: 'Тестовый пользователь',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // Тестируем уведомление о назначении
    console.log('1️⃣ Тест уведомления о назначении:');
    await sendAssignmentNotification('123456789', testTicket);
    
    console.log('\n2️⃣ Тест уведомления об изменении статуса:');
    await sendStatusUpdateNotification('123456789', testTicket, 'in-progress');
    
    console.log('\n3️⃣ Тест уведомления о комментарии:');
    await sendCommentNotification('123456789', testTicket, 'Тестовый комментарий', 'Тестовый автор');
    
    console.log('\n✅ Тестирование завершено!');
}

// Основная функция
async function main() {
    console.log('🔔 Система уведомлений Helpdesk Park\n');
    
    if (process.argv.length > 2) {
        const command = process.argv[2];
        
        switch (command) {
            case 'assign':
                if (process.argv.length < 5) {
                    console.log('❌ Использование: node send-notification.js assign USER_ID TICKET_TITLE');
                    return;
                }
                const userId = process.argv[3];
                const ticketTitle = process.argv[4];
                const ticketData = {
                    title: ticketTitle,
                    description: 'Описание заявки',
                    category: 'technical',
                    priority: 'medium',
                    createdBy: 'Система',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                await sendAssignmentNotification(userId, ticketData);
                break;
                
            case 'status':
                if (process.argv.length < 6) {
                    console.log('❌ Использование: node send-notification.js status USER_ID TICKET_TITLE NEW_STATUS');
                    return;
                }
                const statusUserId = process.argv[3];
                const statusTicketTitle = process.argv[4];
                const newStatus = process.argv[5];
                const statusTicketData = {
                    title: statusTicketTitle,
                    description: 'Описание заявки',
                    category: 'technical',
                    priority: 'medium',
                    createdBy: 'Система',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                await sendStatusUpdateNotification(statusUserId, statusTicketData, newStatus);
                break;
                
            case 'comment':
                if (process.argv.length < 6) {
                    console.log('❌ Использование: node send-notification.js comment USER_ID TICKET_TITLE COMMENT_TEXT');
                    return;
                }
                const commentUserId = process.argv[3];
                const commentTicketTitle = process.argv[4];
                const commentText = process.argv[5];
                const commentTicketData = {
                    title: commentTicketTitle,
                    description: 'Описание заявки',
                    category: 'technical',
                    priority: 'medium',
                    createdBy: 'Система',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                await sendCommentNotification(commentUserId, commentTicketData, commentText, 'Тестовый автор');
                break;
                
            case 'test':
                await testNotifications();
                break;
                
            default:
                console.log('❌ Неизвестная команда. Доступные команды:');
                console.log('  assign USER_ID TICKET_TITLE - уведомление о назначении');
                console.log('  status USER_ID TICKET_TITLE NEW_STATUS - уведомление об изменении статуса');
                console.log('  comment USER_ID TICKET_TITLE COMMENT_TEXT - уведомление о комментарии');
                console.log('  test - тестирование всех уведомлений');
        }
    } else {
        console.log('📚 Инструкция по использованию:');
        console.log('1. node send-notification.js assign USER_ID TICKET_TITLE');
        console.log('2. node send-notification.js status USER_ID TICKET_TITLE NEW_STATUS');
        console.log('3. node send-notification.js comment USER_ID TICKET_TITLE COMMENT_TEXT');
        console.log('4. node send-notification.js test');
        console.log('\n💡 Замените USER_ID на реальный ID пользователя Telegram');
    }
}

// Запуск скрипта
if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    sendNotification,
    sendAssignmentNotification,
    sendStatusUpdateNotification,
    sendCommentNotification
};
