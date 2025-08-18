import React, { useState, useEffect } from 'react';
import { useHybridTelegramMCP } from '../hooks/useHybridTelegramMCP';

/**
 * Демонстрационный компонент для гибридной MCP системы
 * Показывает возможности Node.js MCP + Python MCP
 */
export const HybridTelegramDemo: React.FC = () => {
  const [status, setStatus] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [tools, setTools] = useState<any>(null);
  
  const {
    loading,
    error,
    clearError,
    getMCPStatus,
    getSystemAnalytics,
    getAvailableTools,
    sendTicketNotification,
    createGroup,
    createSupportGroup,
    testHybridSystem
  } = useHybridTelegramMCP();

  // Загрузка начальных данных
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [statusData, analyticsData, toolsData] = await Promise.all([
        getMCPStatus(),
        getSystemAnalytics(),
        getAvailableTools()
      ]);
      
      setStatus(statusData);
      setAnalytics(analyticsData);
      setTools(toolsData);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  // Тестовые данные
  const testTicket = {
    id: 'ticket_123456',
    title: 'Проблема с доступом к системе',
    status: 'ASSIGNED',
    priority: 'HIGH',
    service: { name: 'IT Support' },
    location: { name: 'Главный офис' }
  };

  const handleTestNodeMCP = async () => {
    try {
      const result = await testHybridSystem('test_node_mcp');
      alert(`Node.js MCP Test: ${JSON.stringify(result, null, 2)}`);
    } catch (err) {
      alert(`Node.js MCP Test Failed: ${err}`);
    }
  };

  const handleTestPythonMCP = async () => {
    try {
      const result = await testHybridSystem('test_python_mcp');
      alert(`Python MCP Test: ${JSON.stringify(result, null, 2)}`);
    } catch (err) {
      alert(`Python MCP Test Failed: ${err}`);
    }
  };

  const handleSendTicketNotification = async () => {
    try {
      const result = await sendTicketNotification(
        '@support_team',
        testTicket,
        'ASSIGNED'
      );
      alert(`Ticket notification sent: ${JSON.stringify(result, null, 2)}`);
    } catch (err) {
      alert(`Failed to send ticket notification: ${err}`);
    }
  };

  const handleCreateGroup = async () => {
    try {
      const result = await createGroup('Test Group', [123456789, 987654321]);
      alert(`Group created: ${JSON.stringify(result, null, 2)}`);
    } catch (err) {
      alert(`Failed to create group: ${err}`);
    }
  };

  const handleCreateSupportGroup = async () => {
    try {
      const result = await createSupportGroup(
        'IT Support Team',
        [111111111, 222222222, 333333333],
        '🚀 Добро пожаловать в команду IT поддержки!\n\nЗдесь вы можете:\n• Обсуждать технические вопросы\n• Получать уведомления о заявках\n• Координировать работу'
      );
      alert(`Support group created: ${JSON.stringify(result, null, 2)}`);
    } catch (err) {
      alert(`Failed to create support group: ${err}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🚀🐍 Гибридная MCP система для Telegram
        </h1>
        <p className="text-gray-600">
          Демонстрация возможностей Node.js MCP + Python MCP
        </p>
      </div>

      {/* Статус системы */}
      {status && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">📊 Статус системы</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg ${status.node_mcp.ready ? 'bg-green-100' : 'bg-red-100'}`}>
              <h3 className="font-medium">🚀 Node.js MCP</h3>
              <p className={`text-sm ${status.node_mcp.ready ? 'text-green-700' : 'text-red-700'}`}>
                {status.node_mcp.ready ? 'Готов к работе' : 'Не готов'}
              </p>
              <p className="text-xs text-gray-600">{status.node_mcp.description}</p>
            </div>
            <div className={`p-4 rounded-lg ${status.python_mcp.ready ? 'bg-green-100' : 'bg-red-100'}`}>
              <h3 className="font-medium">🐍 Python MCP</h3>
              <p className={`text-sm ${status.python_mcp.ready ? 'text-green-700' : 'text-red-700'}`}>
                {status.python_mcp.ready ? 'Готов к работе' : 'Не готов'}
              </p>
              <p className="text-xs text-gray-600">{status.python_mcp.description}</p>
            </div>
            <div className={`p-4 rounded-lg ${status.hybrid ? 'bg-blue-100' : 'bg-yellow-100'}`}>
              <h3 className="font-medium">🚀🐍 Гибридная система</h3>
              <p className={`text-sm ${status.hybrid ? 'text-blue-700' : 'text-yellow-700'}`}>
                {status.hybrid ? 'Полностью готова' : 'Частично готова'}
              </p>
              <p className="text-xs text-gray-600">Объединение возможностей</p>
            </div>
          </div>
        </div>
      )}

      {/* Доступные инструменты */}
      {tools && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">🛠️ Доступные инструменты</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-green-700 mb-2">🚀 Node.js MCP ({tools.node_mcp.tools_count})</h3>
              <ul className="text-sm space-y-1">
                {tools.node_mcp.tools.map((tool: string, index: number) => (
                  <li key={index} className="text-gray-600">• {tool}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-blue-700 mb-2">🐍 Python MCP ({tools.python_mcp.tools_count})</h3>
              <ul className="text-sm space-y-1">
                {tools.python_mcp.tools.map((tool: string, index: number) => (
                  <li key={index} className="text-gray-600">• {tool}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-700">
              <strong>Всего инструментов:</strong> {tools.total_tools}
            </p>
          </div>
        </div>
      )}

      {/* Тестирование */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">🧪 Тестирование системы</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleTestNodeMCP}
            disabled={loading}
            className="p-3 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            Тест Node.js MCP
          </button>
          <button
            onClick={handleTestPythonMCP}
            disabled={loading}
            className="p-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Тест Python MCP
          </button>
        </div>
      </div>

      {/* Демонстрация функций */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">🎯 Демонстрация функций</h2>
        <div className="space-y-4">
          <div className="p-4 border rounded">
            <h3 className="font-medium mb-2">🚀 Node.js MCP - Отправка уведомления о заявке</h3>
            <p className="text-sm text-gray-600 mb-3">
              Отправка специализированного уведомления с форматированием для Helpdesk
            </p>
            <button
              onClick={handleSendTicketNotification}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              Отправить уведомление
            </button>
          </div>

          <div className="p-4 border rounded">
            <h3 className="font-medium mb-2">🐍 Python MCP - Создание группы</h3>
            <p className="text-sm text-gray-600 mb-3">
              Создание новой группы через Python MCP (общие Telegram функции)
            </p>
            <button
              onClick={handleCreateGroup}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Создать группу
            </button>
          </div>

          <div className="p-4 border rounded">
            <h3 className="font-medium mb-2">🚀🐍 Гибридная функция - Создание группы поддержки</h3>
            <p className="text-sm text-gray-600 mb-3">
              Создание группы через Python MCP + отправка приветственного сообщения через Node.js MCP
            </p>
            <button
              onClick={handleCreateSupportGroup}
              disabled={loading}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
            >
              Создать группу поддержки
            </button>
          </div>
        </div>
      </div>

      {/* Ошибки */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-red-800 font-medium">Ошибка</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-red-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Загрузка */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Загрузка...</p>
        </div>
      )}

      {/* Информация о системе */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">ℹ️ Информация о системе</h2>
        <div className="text-sm text-gray-600 space-y-2">
          <p>
            <strong>Гибридная MCP система</strong> объединяет возможности двух MCP серверов:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>Node.js MCP:</strong> Специализированные функции для Telegram Mini App и Helpdesk систем</li>
            <li><strong>Python MCP:</strong> Универсальные функции для работы с Telegram (чаты, группы, контакты, медиа)</li>
            <li><strong>Гибридные функции:</strong> Автоматический выбор лучшего MCP + fallback механизм</li>
          </ul>
          <p className="mt-4">
            <strong>Всего доступно:</strong> {tools?.total_tools || '...'} инструментов для работы с Telegram
          </p>
        </div>
      </div>
    </div>
  );
};
