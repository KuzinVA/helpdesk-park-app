import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTelegram } from './useTelegram';

export const useTelegramButtons = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    showMainButton, 
    hideMainButton, 
    showBackButton, 
    hideBackButton,
    hapticFeedback 
  } = useTelegram();

  // Автоматическое управление кнопками в зависимости от страницы
  useEffect(() => {
    const path = location.pathname;
    
    // Скрываем все кнопки по умолчанию
    hideMainButton();
    hideBackButton();

    // Настраиваем кнопки в зависимости от страницы
    switch (path) {
      case '/tickets':
        showMainButton('Создать заявку', () => {
          hapticFeedback('light');
          navigate('/create');
        });
        break;
        
      case '/create':
        showMainButton('Сохранить заявку', () => {
          hapticFeedback('medium');
          // Здесь будет логика сохранения
        });
        showBackButton();
        break;
        
      case '/stats':
        showMainButton('Обновить', () => {
          hapticFeedback('light');
          // Здесь будет логика обновления статистики
        });
        break;
        
      case '/profile':
        showMainButton('Сохранить', () => {
          hapticFeedback('medium');
          // Здесь будет логика сохранения профиля
        });
        break;
        
      default:
        // Для страниц с деталями заявок
        if (path.startsWith('/tickets/') && path !== '/tickets') {
          showMainButton('Редактировать', () => {
            hapticFeedback('medium');
            // Здесь будет логика редактирования
          });
          showBackButton();
        }
        break;
    }
  }, [location, showMainButton, hideMainButton, showBackButton, hideBackButton, navigate, hapticFeedback]);

  // Функции для ручного управления кнопками
  const setMainButton = useCallback((text: string, onClick: () => void, color?: string) => {
    showMainButton(text, onClick, color);
  }, [showMainButton]);

  const setBackButton = useCallback((onClick?: () => void) => {
    if (onClick) {
      // Если передана кастомная функция, используем её
      showBackButton();
      // Здесь нужно будет переопределить обработчик
    } else {
      // По умолчанию - возврат назад
      showBackButton();
    }
  }, [showBackButton]);

  const clearButtons = useCallback(() => {
    hideMainButton();
    hideBackButton();
  }, [hideMainButton, hideBackButton]);

  return {
    setMainButton,
    setBackButton,
    clearButtons,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
  };
};
