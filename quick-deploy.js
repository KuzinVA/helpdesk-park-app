const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;

// Создаем продакшен файлы
function createProductionFiles() {
    console.log('📁 Создаем продакшен файлы...');
    
    try {
        // Копируем production.html как index.html
        const productionContent = fs.readFileSync('frontend/production.html', 'utf8');
        fs.writeFileSync('index.html', productionContent);
        console.log('✅ index.html создан');
        
        // Копируем simple-test.html как test.html
        const testContent = fs.readFileSync('frontend/simple-test.html', 'utf8');
        fs.writeFileSync('test.html', testContent);
        console.log('✅ test.html создан');
        
        // Создаем простой README
        const readmeContent = `# 🚀 Helpdesk Park - Telegram Mini App

## 🌐 Демо

- [Основное приложение](http://localhost:${PORT}/)
- [Тестовая страница](http://localhost:${PORT}/test.html)

## 📱 Telegram бот

@helpdeskParkApp_bot

## 🚀 Возможности

- 📋 Управление заявками
- ➕ Создание новых заявок
- 📊 Статистика и аналитика
- 👤 Профиль пользователя
- 🔔 Уведомления

## 🛠️ Технологии

- HTML5 + CSS3 + JavaScript
- Telegram WebApp API
- Tailwind CSS
- Адаптивный дизайн

## 📞 Поддержка

По вопросам обращайтесь к разработчику.
`;
        
        fs.writeFileSync('README.md', readmeContent);
        console.log('✅ README.md создан');
        
    } catch (error) {
        console.error('❌ Ошибка при создании файлов:', error.message);
        process.exit(1);
    }
}

// MIME типы
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// Создаем HTTP сервер
const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
    let pathname = parsedUrl.pathname;
    
    // Обрабатываем корневой путь
    if (pathname === '/') {
        pathname = '/index.html';
    }
    
    // Получаем расширение файла
    const ext = path.extname(pathname);
    const mimeType = mimeTypes[ext] || 'text/plain';
    
    // Путь к файлу
    let filePath = path.join(__dirname, pathname);
    
    // Проверяем существование файла
    if (!fs.existsSync(filePath)) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>404 - Файл не найден</title>
                <meta charset="utf-8">
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                    .error { color: #e74c3c; font-size: 72px; margin-bottom: 20px; }
                    .message { color: #2c3e50; font-size: 18px; margin-bottom: 30px; }
                    .link { color: #3498db; text-decoration: none; }
                    .link:hover { text-decoration: underline; }
                </style>
            </head>
            <body>
                <div class="error">404</div>
                <div class="message">Файл не найден</div>
                <a href="/" class="link">Вернуться на главную</a>
            </body>
            </html>
        `);
        return;
    }
    
    // Читаем файл
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end('Ошибка сервера');
            return;
        }
        
        // Устанавливаем заголовки
        res.writeHead(200, { 
            'Content-Type': mimeType,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        
        // Отправляем файл
        res.end(data);
    });
});

// Запускаем сервер
function startServer() {
    server.listen(PORT, () => {
        console.log(`🚀 Продакшен сервер запущен на порту ${PORT}`);
        console.log(`📱 Откройте в браузере: http://localhost:${PORT}`);
        console.log(`🌐 Или используйте для Telegram бота: http://localhost:${PORT}`);
        console.log(`\n📋 Доступные файлы:`);
        console.log(`   • / - Основное приложение (index.html)`);
        console.log(`   • /test.html - Тестовая страница`);
        console.log(`\n📱 Для Telegram бота:`);
        console.log(`   1. Обновите URL в setup-miniapp.js: http://localhost:${PORT}`);
        console.log(`   2. Запустите: node setup-miniapp.js`);
        console.log(`   3. Протестируйте бота в Telegram`);
        console.log(`\n⚠️  Для продакшена замените localhost на реальный URL`);
    });
}

// Обработка ошибок
server.on('error', (err) => {
    console.error('❌ Ошибка сервера:', err);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Останавливаем сервер...');
    server.close(() => {
        console.log('✅ Сервер остановлен');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Получен сигнал SIGTERM, останавливаем сервер...');
    server.close(() => {
        console.log('✅ Сервер остановлен');
        process.exit(0);
    });
});

// Основная функция
function main() {
    console.log('🚀 Быстрое развертывание Helpdesk Park...\n');
    
    // Создаем продакшен файлы
    createProductionFiles();
    
    // Запускаем сервер
    startServer();
}

// Запускаем
main();
