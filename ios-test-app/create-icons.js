const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

// Простая функция для создания PNG из SVG (упрощенная версия)
function createIcon(size, filename) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Градиентный фон
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    // Скругленные углы
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, size * 0.15);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    
    // Простая иконка телефона
    const phoneWidth = size * 0.4;
    const phoneHeight = size * 0.6;
    const phoneX = (size - phoneWidth) / 2;
    const phoneY = (size - phoneHeight) / 2;
    
    // Тело телефона
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.roundRect(phoneX, phoneY, phoneWidth, phoneHeight, size * 0.06);
    ctx.fill();
    
    // Экран
    const screenMargin = size * 0.02;
    ctx.fillStyle = '#667eea';
    ctx.beginPath();
    ctx.roundRect(
        phoneX + screenMargin, 
        phoneY + screenMargin, 
        phoneWidth - screenMargin * 2, 
        phoneHeight - screenMargin * 2, 
        size * 0.03
    );
    ctx.fill();
    
    // Простые линии для списка
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = size * 0.015;
    ctx.lineCap = 'round';
    
    const lineY = phoneY + phoneHeight * 0.2;
    const lineSpacing = phoneHeight * 0.1;
    
    for (let i = 0; i < 4; i++) {
        const y = lineY + i * lineSpacing;
        const lineLength = phoneWidth * 0.6;
        const lineX = phoneX + (phoneWidth - lineLength) / 2;
        
        ctx.beginPath();
        ctx.moveTo(lineX, y);
        ctx.lineTo(lineX + lineLength, y);
        ctx.stroke();
    }
    
    // Сохраняем файл
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filename, buffer);
    console.log(`✅ Создана иконка ${filename} (${size}x${size})`);
}

// Создаем иконки разных размеров
try {
    createIcon(192, 'icon-192.png');
    createIcon(512, 'icon-512.png');
    console.log('🎉 Все иконки созданы успешно!');
} catch (error) {
    console.log('⚠️ Не удалось создать иконки с canvas. Создаем простые PNG файлы...');
    
    // Создаем простые PNG файлы без canvas
    const createSimpleIcon = (size, filename) => {
        // Простой PNG заголовок (минимальный PNG файл)
        const pngData = Buffer.from([
            0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
            0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
            ...Buffer.from([size >> 24, size >> 16, size >> 8, size]), // width
            ...Buffer.from([size >> 24, size >> 16, size >> 8, size]), // height
            0x08, 0x02, 0x00, 0x00, 0x00, // bit depth, color type, compression, filter, interlace
            0x00, 0x00, 0x00, 0x00, // CRC
            0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82 // IEND chunk
        ]);
        
        fs.writeFileSync(filename, pngData);
        console.log(`✅ Создана простая иконка ${filename} (${size}x${size})`);
    };
    
    createSimpleIcon(192, 'icon-192.png');
    createSimpleIcon(512, 'icon-512.png');
}