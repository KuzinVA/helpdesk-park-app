const https = require('https');
const http = require('http');

console.log('🔍 Проверяем все платформы деплоя...');
console.log('');

// Функция для задержки
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Функция для проверки HTTP статуса
function checkUrl(url, platform) {
  return new Promise((resolve) => {
    const client = url.startsWith('https:') ? https : http;
    
    const req = client.get(url, { timeout: 10000 }, (res) => {
      console.log(`✅ ${platform}: ${url} - Статус: ${res.statusCode}`);
      resolve({ platform, url, status: res.statusCode, working: true });
    });
    
    req.on('error', (error) => {
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        console.log(`❌ ${platform}: ${url} - Сервис недоступен`);
      } else {
        console.log(`❌ ${platform}: ${url} - Ошибка: ${error.code || error.message}`);
      }
      resolve({ platform, url, status: 'ERROR', working: false });
    });
    
    req.setTimeout(10000, () => {
      console.log(`⏰ ${platform}: ${url} - Таймаут`);
      resolve({ platform, url, status: 'TIMEOUT', working: false });
    });
  });
}

async function checkAllPlatforms() {
  const platforms = [
    {
      name: 'GitHub Pages (Frontend)',
      url: 'https://kuzinva.github.io/helpdesk-park-app/',
      description: 'Основной фронтенд'
    },
    {
      name: 'Render (Backend API)',
      url: 'https://helpdesk-park-api.onrender.com/api/health',
      description: 'Backend API'
    },
    {
      name: 'Render (Frontend)',
      url: 'https://helpdesk-park-frontend.onrender.com',
      description: 'Frontend на Render'
    },
    {
      name: 'Render (Chat API)',
      url: 'https://helpdesk-park-chat-api.onrender.com',
      description: 'Chat API'
    },
    {
      name: 'Railway (Backend)',
      url: 'https://helpdesk-park-production.up.railway.app/api/health',
      description: 'Backend на Railway'
    },
    {
      name: 'Railway (Chat API)',
      url: 'https://helpdesk-park-chat-api.up.railway.app',
      description: 'Chat API на Railway'
    }
  ];

  console.log('📋 Проверяем платформы:');
  console.log('');

  const results = [];
  
  for (const platform of platforms) {
    console.log(`🔍 Проверяем ${platform.name}...`);
    const result = await checkUrl(platform.url, platform.name);
    results.push({ ...result, description: platform.description });
    
    // Добавляем задержку между запросами
    if (platform !== platforms[platforms.length - 1]) {
      console.log('⏳ Ждем 2 секунды...');
      await delay(2000);
    }
    console.log('');
  }

  // Анализ результатов
  console.log('📊 АНАЛИЗ РЕЗУЛЬТАТОВ:');
  console.log('');

  const working = results.filter(r => r.working);
  const notWorking = results.filter(r => !r.working);

  if (working.length > 0) {
    console.log('✅ РАБОТАЮТ:');
    working.forEach(r => {
      console.log(`   • ${r.platform} - ${r.url}`);
    });
  }

  if (notWorking.length > 0) {
    console.log('');
    console.log('❌ НЕ РАБОТАЮТ:');
    notWorking.forEach(r => {
      console.log(`   • ${r.platform} - ${r.url}`);
    });
  }

  console.log('');
  console.log('🎯 РЕКОМЕНДАЦИИ:');
  
  if (working.some(r => r.platform.includes('GitHub Pages'))) {
    console.log('   ✅ GitHub Pages работает - фронтенд доступен');
  }
  
  if (working.some(r => r.platform.includes('Railway'))) {
    console.log('   ✅ Railway работает - backend доступен');
  }
  
  if (working.some(r => r.platform.includes('Render'))) {
    console.log('   ✅ Render работает - некоторые сервисы доступны');
  }

  console.log('');
  console.log('🔧 СЛЕДУЮЩИЕ ШАГИ:');
  console.log('   1. Определить, какие сервисы реально нужны');
  console.log('   2. Отключить ненужные платформы');
  console.log('   3. Настроить уведомления только для важных');
}

// Запуск проверки
checkAllPlatforms();
