import React, { useState, useRef, useEffect } from 'react';
import { useMentionUsers } from '@/hooks/useMentionUsers';

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName?: string;
  displayName: string;
  role: string;
  service?: string;
}

interface MentionInputProps {
  value: string;
  onChange: (value: string, mentions: User[]) => void;
  placeholder?: string;
  className?: string;
  chatId?: string;
}

export const MentionInput: React.FC<MentionInputProps> = ({
  value,
  onChange,
  placeholder = 'Введите описание...',
  className = '',
  chatId,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentMention, setCurrentMention] = useState<{
    start: number;
    query: string;
  } | null>(null);
  
  const { searchUsers, parseMentions } = useMentionUsers();

  // Обработка изменения текста
  const handleChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPosition = e.target.selectionStart;

    // Поиск активного упоминания
    const beforeCursor = newValue.substring(0, cursorPosition);
    const mentionMatch = beforeCursor.match(/@(\w*)$/);

    if (mentionMatch) {
      const mentionStart = cursorPosition - mentionMatch[0].length;
      const query = mentionMatch[1];

      setCurrentMention({
        start: mentionStart,
        query,
      });

      // Поиск пользователей для автодополнения
      if (query.length >= 1) {
        try {
          const users = await searchUsers({
            query,
            chatIds: chatId ? [chatId] : undefined,
            limit: 5,
          });
          setSuggestions(users);
          setShowSuggestions(true);
          setSelectedIndex(0);
        } catch (error) {
          console.error('Error searching users:', error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setCurrentMention(null);
      setShowSuggestions(false);
      setSuggestions([]);
    }

    // Парсим упоминания для передачи в onChange
    try {
      const { mentions } = await parseMentions(newValue);
      const mentionedUsers = mentions
        .filter(m => m.user)
        .map(m => m.user!)
        .filter((u): u is User => u !== undefined);
      
      onChange(newValue, mentionedUsers);
    } catch (error) {
      onChange(newValue, []);
    }
  };

  // Обработка выбора пользователя
  const selectUser = (user: User) => {
    if (!currentMention || !textareaRef.current) return;

    const beforeMention = value.substring(0, currentMention.start);
    const afterMention = value.substring(textareaRef.current.selectionStart);
    const newValue = `${beforeMention}@${user.username} ${afterMention}`;

    setShowSuggestions(false);
    setCurrentMention(null);
    setSuggestions([]);

    // Устанавливаем курсор после упоминания
    setTimeout(() => {
      if (textareaRef.current) {
        const newPosition = beforeMention.length + user.username.length + 2;
        textareaRef.current.setSelectionRange(newPosition, newPosition);
        textareaRef.current.focus();
      }
    }, 0);

    // Парсим упоминания
    parseMentions(newValue).then(({ mentions }) => {
      const mentionedUsers = mentions
        .filter(m => m.user)
        .map(m => m.user!)
        .filter((u): u is User => u !== undefined);
      onChange(newValue, mentionedUsers);
    });
  };

  // Обработка клавиш
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
      case 'Tab':
        e.preventDefault();
        if (suggestions[selectedIndex]) {
          selectUser(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

  // Автоматическое изменение высоты textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`apple-input resize-none min-h-[44px] max-h-40 ${className}`}
        style={{ 
          width: '100%',
          overflow: 'hidden',
        }}
      />

      {/* Выпадающий список с предложениями */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          className="absolute z-50 w-full mt-1 apple-card max-h-48 overflow-y-auto"
          style={{
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--separator-non-opaque)',
            borderRadius: 'var(--radius-medium)',
            boxShadow: 'var(--shadow-modal)',
          }}
        >
          {suggestions.map((user, index) => (
            <div
              key={user.id}
              className={`px-3 py-2 cursor-pointer apple-transition ${
                index === selectedIndex 
                  ? 'apple-button-secondary' 
                  : 'hover:bg-fill-quaternary'
              }`}
              style={{
                backgroundColor: index === selectedIndex 
                  ? 'var(--fill-tertiary)' 
                  : 'transparent'
              }}
              onClick={() => selectUser(user)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="apple-text-body font-medium" 
                       style={{ color: 'var(--label-primary)' }}>
                    @{user.username}
                  </div>
                  <div className="apple-text-caption" 
                       style={{ color: 'var(--label-secondary)' }}>
                    {user.firstName} {user.lastName || ''}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="apple-text-caption px-2 py-0.5 rounded" 
                       style={{ 
                         backgroundColor: 'var(--system-blue)',
                         color: 'white'
                       }}>
                    {user.role}
                  </div>
                  {user.service && (
                    <div className="apple-text-caption mt-1" 
                         style={{ color: 'var(--label-tertiary)' }}>
                      {user.service}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
