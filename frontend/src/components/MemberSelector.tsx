import React, { useState, useEffect } from 'react';
import { useChatMembers } from '../hooks/useChatMembers';
import { TelegramUser } from '../services/telegramApi';

interface MemberSelectorProps {
  chatId?: number | string;
  selectedMembers: TelegramUser[];
  onMembersChange: (members: TelegramUser[]) => void;
  placeholder?: string;
  multiple?: boolean;
  maxMembers?: number;
  className?: string;
}

export const MemberSelector: React.FC<MemberSelectorProps> = ({
  chatId,
  selectedMembers,
  onMembersChange,
  placeholder = 'Выберите участников...',
  multiple = true,
  maxMembers = 5,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const {
    members,
    admins,
    loading,
    error,
    getDisplayName,
    getFullDisplayName,
    isAdmin,
    searchMembers
  } = useChatMembers({ chatId, autoFetch: true });

  // Обработка поиска
  useEffect(() => {
    searchMembers(searchQuery);
  }, [searchQuery, searchMembers]);

  // Переключение выбора участника
  const toggleMember = (member: TelegramUser) => {
    if (multiple) {
      const isSelected = selectedMembers.some(m => m.id === member.id);
      if (isSelected) {
        onMembersChange(selectedMembers.filter(m => m.id !== member.id));
      } else {
        if (selectedMembers.length < maxMembers) {
          onMembersChange([...selectedMembers, member]);
        }
      }
    } else {
      onMembersChange([member]);
      setIsOpen(false);
    }
  };

  // Удаление выбранного участника
  const removeMember = (memberId: number) => {
    onMembersChange(selectedMembers.filter(m => m.id !== memberId));
  };

  // Получить отображаемый текст
  const getDisplayText = () => {
    if (selectedMembers.length === 0) {
      return placeholder;
    }
    
    if (selectedMembers.length === 1) {
      return getDisplayName(selectedMembers[0]);
    }
    
    return `Выбрано ${selectedMembers.length} участников`;
  };

  // Фильтрация участников по поиску
  const filteredMembers = members.filter(member => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    const firstName = member.first_name?.toLowerCase() || '';
    const lastName = member.last_name?.toLowerCase() || '';
    const username = member.username?.toLowerCase() || '';
    const fullName = `${firstName} ${lastName}`.trim();

    return firstName.includes(query) ||
           lastName.includes(query) ||
           username.includes(query) ||
           fullName.includes(query);
  });

  return (
    <div className={`member-selector ${className}`}>
      {/* Поле выбора */}
      <div 
        className="member-selector-field"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="selected-members">
          {selectedMembers.length > 0 ? (
            <div className="selected-members-list">
              {selectedMembers.map(member => (
                <div key={member.id} className="selected-member-tag">
                  <span>{getDisplayName(member)}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeMember(member.id);
                    }}
                    className="remove-member-btn"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <span className="placeholder">{placeholder}</span>
          )}
        </div>
        <span className="dropdown-arrow">▼</span>
      </div>

      {/* Выпадающий список */}
      {isOpen && (
        <div className="member-selector-dropdown">
          {/* Поиск */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Поиск участников..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="member-search-input"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Список участников */}
          <div className="members-list">
            {loading ? (
              <div className="loading-state">
                <span>Загрузка участников...</span>
              </div>
            ) : error ? (
              <div className="error-state">
                <span>Ошибка: {error}</span>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="empty-state">
                <span>Участники не найдены</span>
              </div>
            ) : (
              filteredMembers.map(member => {
                const isSelected = selectedMembers.some(m => m.id === member.id);
                const memberIsAdmin = isAdmin(member.id);
                
                return (
                  <div
                    key={member.id}
                    className={`member-item ${isSelected ? 'selected' : ''} ${memberIsAdmin ? 'admin' : ''}`}
                    onClick={() => toggleMember(member)}
                  >
                    <div className="member-avatar">
                      {memberIsAdmin ? '👑' : '👤'}
                    </div>
                    <div className="member-info">
                      <div className="member-name">
                        {getDisplayName(member)}
                        {memberIsAdmin && <span className="admin-badge">Админ</span>}
                      </div>
                      <div className="member-username">
                        {member.username ? `@${member.username}` : `ID: ${member.id}`}
                      </div>
                    </div>
                    <div className="member-status">
                      {isSelected ? '✅' : '⚪'}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Информация о выбранных */}
          {selectedMembers.length > 0 && (
            <div className="selection-info">
              <span>Выбрано: {selectedMembers.length}</span>
              {multiple && maxMembers && (
                <span>Максимум: {maxMembers}</span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
