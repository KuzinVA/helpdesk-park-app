const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;

// MIME типы для файлов
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
    const parsedUrl = url.parse(req.url);
    let pathname = parsedUrl.pathname;
    
    // Обрабатываем корневой путь
    if (pathname === '/') {
        pathname = '/simple-test.html';
    }
    
    // Получаем расширение файла
    const ext = path.extname(pathname);
    const mimeType = mimeTypes[ext] || 'text/plain';
    
    // Путь к файлу
    let filePath;
    if (pathname.startsWith('/frontend/')) {
        filePath = path.join(__dirname, pathname);
    } else {
        filePath = path.join(__dirname, 'frontend', pathname);
    }
    
    // Проверяем существование файла
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // Файл не найден
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
});

// Запускаем сервер
server.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
    console.log(`📱 Откройте в браузере: http://localhost:${PORT}`);
    console.log(`🌐 Или используйте внешний URL для Telegram бота`);
    console.log(`\n📋 Доступные файлы:`);
    console.log(`   • / - Главная страница (simple-test.html)`);
    console.log(`   • /telegram-test.html - Расширенное тестирование`);
    console.log(`   • /index.html - Основное приложение (если собрано)`);
});

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
