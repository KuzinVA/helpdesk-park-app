const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Статические файлы
app.use(express.static(path.join(__dirname)));

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
    console.log(`📱 Откройте в браузере и добавьте на главный экран iPhone!`);
});

// Обработка ошибок
process.on('uncaughtException', (err) => {
    console.error('Необработанная ошибка:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Необработанное отклонение промиса:', reason);
});