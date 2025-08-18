#!/usr/bin/env node

/**
 * Генератор JWT секрета для Render.com деплоя
 */

const crypto = require('crypto');

// Генерируем случайный секрет длиной 64 байта
const jwtSecret = crypto.randomBytes(64).toString('hex');

console.log('🔐 Ваш JWT_SECRET для Render.com:');
console.log('');
console.log(jwtSecret);
console.log('');
console.log('📋 Скопируйте этот ключ и вставьте как JWT_SECRET в Render.com');
console.log('⚠️  Сохраните его - он понадобится для всех сервисов!');
