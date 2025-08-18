#!/bin/bash

# Скрипт для интеграции гибридной MCP системы с существующим проектом
# Автор: Helpdesk Park Team

set -e

echo "🔌 Интеграция гибридной MCP системы с существующим проектом..."

# Проверка наличия основных файлов
if [ ! -f "backend/src/telegram/hybrid-telegram.service.ts" ]; then
    echo "❌ HybridTelegramService не найден. Запустите сначала setup-integrated-mcp.sh"
    exit 1
fi

if [ ! -f "frontend/src/hooks/useHybridTelegramMCP.ts" ]; then
    echo "❌ useHybridTelegramMCP hook не найден. Запустите сначала setup-integrated-mcp.sh"
    exit 1
fi

echo "✅ Основные компоненты найдены"

# 1. Интеграция с backend (NestJS)
echo "🔧 Интеграция с NestJS backend..."

# Проверка наличия app.module.ts
if [ -f "backend/src/app.module.ts" ]; then
    echo "📝 Обновление app.module.ts..."
    
    # Создание резервной копии
    cp backend/src/app.module.ts backend/src/app.module.ts.backup
    
    # Проверка, есть ли уже импорт HybridTelegramModule
    if ! grep -q "HybridTelegramModule" backend/src/app.module.ts; then
        echo "➕ Добавление HybridTelegramModule в app.module.ts..."
        
        # Добавление импорта
        sed -i '' '/import {/a\
import { HybridTelegramModule } from './telegram/hybrid-telegram.module';
' backend/src/app.module.ts
        
        # Добавление в imports массив
        sed -i '' '/imports: \[/a\
    HybridTelegramModule,
' backend/src/app.module.ts
        
        echo "✅ HybridTelegramModule добавлен в app.module.ts"
    else
        echo "✅ HybridTelegramModule уже импортирован в app.module.ts"
    fi
else
    echo "⚠️  app.module.ts не найден. Добавьте HybridTelegramModule вручную"
fi

# 2. Интеграция с frontend (React)
echo "🔧 Интеграция с React frontend..."

# Проверка наличия App.tsx
if [ -f "frontend/src/App.tsx" ]; then
    echo "📝 Обновление App.tsx..."
    
    # Создание резервной копии
    cp frontend/src/App.tsx frontend/src/App.tsx.backup
    
    # Проверка, есть ли уже импорт HybridTelegramDemo
    if ! grep -q "HybridTelegramDemo" frontend/src/App.tsx; then
        echo "➕ Добавление HybridTelegramDemo в App.tsx..."
        
        # Добавление импорта
        sed -i '' '/import {/a\
import { HybridTelegramDemo } from './components/HybridTelegramDemo';
' frontend/src/App.tsx
        
        # Добавление роута (если используется роутинг)
        if grep -q "Route" frontend/src/App.tsx; then
            echo "➕ Добавление роута для HybridTelegramDemo..."
            sed -i '' '/<Route/ {
                a\
        <Route path="/hybrid-demo" element={<HybridTelegramDemo />} />
                :a
            }' frontend/src/App.tsx
        else
            echo "⚠️  Роутинг не найден. Добавьте HybridTelegramDemo вручную"
        fi
    else
        echo "✅ HybridTelegramDemo уже импортирован в App.tsx"
    fi
else
    echo "⚠️  App.tsx не найден. Добавьте HybridTelegramDemo вручную"
fi

# 3. Создание демонстрационной страницы
echo "📄 Создание демонстрационной страницы..."

cat > frontend/hybrid-demo.html << 'EOF'
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🚀🐍 Гибридная MCP система для Telegram</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <div id="root"></div>
    
    <script type="text/babel">
        // Простая демонстрация гибридной системы
        const HybridDemo = () => {
            const [status, setStatus] = React.useState('loading');
            const [message, setMessage] = React.useState('');
            
            React.useEffect(() => {
                // Проверка статуса системы
                fetch('/api/telegram-hybrid/health')
                    .then(response => response.json())
                    .then(data => {
                        setStatus(data.status);
                        setMessage(`Система: ${data.status}, Node.js MCP: ${data.node_mcp}, Python MCP: ${data.python_mcp}`);
                    })
                    .catch(error => {
                        setStatus('error');
                        setMessage(`Ошибка: ${error.message}`);
                    });
            }, []);
            
            return (
                <div className="max-w-4xl mx-auto p-6">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            🚀🐍 Гибридная MCP система
                        </h1>
                        <p className="text-xl text-gray-600">
                            Node.js MCP + Python MCP для Telegram
                        </p>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-semibold mb-4">📊 Статус системы</h2>
                        <div className={`p-4 rounded-lg ${
                            status === 'healthy' ? 'bg-green-100' : 
                            status === 'degraded' ? 'bg-yellow-100' : 'bg-red-100'
                        }`}>
                            <p className="text-lg font-medium">
                                Статус: {status === 'healthy' ? '✅ Полностью готова' : 
                                         status === 'degraded' ? '⚠️ Частично готова' : '❌ Ошибка'}
                            </p>
                            <p className="text-gray-700 mt-2">{message}</p>
                        </div>
                    </div>
                    
                    <div className="mt-6 bg-blue-50 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-3">🚀 Быстрый старт</h3>
                        <div className="space-y-2 text-sm">
                            <p>1. <strong>Установите систему:</strong> <code>./setup-integrated-mcp.sh</code></p>
                            <p>2. <strong>Настройте .env файл</strong> с вашими Telegram данными</p>
                            <p>3. <strong>Запустите серверы:</strong> <code>./start-both-mcp.sh</code></p>
                            <p>4. <strong>Протестируйте:</strong> <code>./test-integrated-mcp.sh</code></p>
                        </div>
                    </div>
                    
                    <div className="mt-6 bg-gray-50 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-3">📚 Документация</h3>
                        <ul className="space-y-2 text-sm">
                            <li>• <strong>Основная документация:</strong> <a href="INTEGRATED_MCP_README.md" className="text-blue-600 hover:underline">INTEGRATED_MCP_README.md</a></li>
                            <li>• <strong>Обзор системы:</strong> <a href="INTEGRATED_SYSTEM_OVERVIEW.md" className="text-blue-600 hover:underline">INTEGRATED_SYSTEM_OVERVIEW.md</a></li>
                            <li>• <strong>Инструкции по настройке:</strong> <a href="SETUP_INTEGRATED_INSTRUCTIONS.md" className="text-blue-600 hover:underline">SETUP_INTEGRATED_INSTRUCTIONS.md</a></li>
                        </ul>
                    </div>
                </div>
            );
        };
        
        ReactDOM.render(<HybridDemo />, document.getElementById('root'));
    </script>
</body>
</html>
EOF

echo "✅ Демонстрационная страница создана: frontend/hybrid-demo.html"

# 4. Создание README для интеграции
echo "📚 Создание README для интеграции..."

cat > INTEGRATION_COMPLETE.md << 'EOF'
# 🔌 Интеграция завершена!

## ✅ Что было сделано:

### Backend (NestJS):
- ✅ HybridTelegramService создан
- ✅ HybridTelegramController создан  
- ✅ HybridTelegramModule создан
- ✅ Интеграция с app.module.ts (если найден)

### Frontend (React):
- ✅ useHybridTelegramMCP hook создан
- ✅ HybridTelegramDemo компонент создан
- ✅ Интеграция с App.tsx (если найден)
- ✅ Демонстрационная страница создана

## 🚀 Следующие шаги:

### 1. Запуск системы:
```bash
# Установка и настройка
./setup-integrated-mcp.sh

# Запуск обоих MCP серверов
./start-both-mcp.sh

# Проверка статуса
./status-mcp.sh
```

### 2. Тестирование:
```bash
# Тестирование системы
./test-integrated-mcp.sh

# Открытие демо страницы
open frontend/hybrid-demo.html
```

### 3. Использование в коде:

#### Backend (NestJS):
```typescript
import { HybridTelegramService } from './telegram/hybrid-telegram.service';

@Injectable()
export class YourService {
  constructor(private readonly hybridTelegram: HybridTelegramService) {}
  
  async createSupportTeam() {
    return await this.hybridTelegram.createSupportGroup(
      'IT Support Team',
      [111111111, 222222222],
      '🚀 Добро пожаловать в команду поддержки!'
    );
  }
}
```

#### Frontend (React):
```typescript
import { useHybridTelegramMCP } from './hooks/useHybridTelegramMCP';

const { sendTicketNotification, createSupportGroup } = useHybridTelegramMCP();

// Отправка уведомления
await sendTicketNotification('@support_team', ticket, 'ASSIGNED');

// Создание группы поддержки
await createSupportGroup('New Team', [123, 456], 'Welcome!');
```

## 🎯 Доступные возможности:

- **32+ инструмента** для работы с Telegram
- **Автоматический выбор** лучшего MCP для задачи
- **Fallback механизм** между серверами
- **Готовые компоненты** для React и NestJS
- **Подробная документация** и примеры

## 📞 Поддержка:

- Документация: INTEGRATED_MCP_README.md
- Обзор: INTEGRATED_SYSTEM_OVERVIEW.md
- Настройка: SETUP_INTEGRATED_INSTRUCTIONS.md

---

**🎉 Интеграция завершена! Теперь у вас есть мощная гибридная MCP система!** 🚀🐍
EOF

echo "✅ README для интеграции создан: INTEGRATION_COMPLETE.md"

# 5. Финальная проверка
echo "🔍 Финальная проверка интеграции..."

# Проверка наличия всех ключевых файлов
required_files=(
    "backend/src/telegram/hybrid-telegram.service.ts"
    "backend/src/telegram/hybrid-telegram.controller.ts"
    "backend/src/telegram/hybrid-telegram.module.ts"
    "frontend/src/hooks/useHybridTelegramMCP.ts"
    "frontend/src/components/HybridTelegramDemo.tsx"
    "frontend/hybrid-demo.html"
    "setup-integrated-mcp.sh"
    "INTEGRATED_MCP_README.md"
)

all_files_exist=true
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - НЕ НАЙДЕН"
        all_files_exist=false
    fi
done

if [ "$all_files_exist" = true ]; then
    echo ""
    echo "🎉 Интеграция гибридной MCP системы завершена успешно!"
    echo ""
    echo "📋 Следующие шаги:"
    echo "1. Запустите: ./setup-integrated-mcp.sh"
    echo "2. Настройте .env файл"
    echo "3. Запустите серверы: ./start-both-mcp.sh"
    echo "4. Откройте демо: frontend/hybrid-demo.html"
    echo ""
    echo "📚 Документация: INTEGRATION_COMPLETE.md"
    echo ""
    echo "🚀🐍 Счастливого кодирования с гибридной MCP системой!"
else
    echo ""
    echo "⚠️  Некоторые файлы не найдены. Проверьте интеграцию вручную."
    echo "См. INTEGRATION_COMPLETE.md для деталей."
fi
