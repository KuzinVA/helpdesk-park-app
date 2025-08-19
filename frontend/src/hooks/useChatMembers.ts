import { useState, useEffect, useCallback } from 'react';
import { telegramApiService, TelegramUser } from '../services/telegramApi';

interface UseChatMembersProps {
  chatId?: number | string;
  autoFetch?: boolean;
}

export const useChatMembers = ({ chatId, autoFetch = true }: UseChatMembersProps = {}) => {
  const [members, setMembers] = useState<TelegramUser[]>([]);
  const [admins, setAdmins] = useState<TelegramUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMembers, setFilteredMembers] = useState<TelegramUser[]>([]);

  // Получить всех участников чата
  const fetchMembers = useCallback(async (targetChatId?: number | string) => {
    if (!targetChatId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const allMembers = await telegramApiService.getAllChatMembers(targetChatId);
      setMembers(allMembers);
      setFilteredMembers(allMembers);
      
      // Получаем администраторов отдельно
      const chatAdmins = await telegramApiService.getChatMembers(targetChatId);
      const adminUsers = chatAdmins.map(admin => admin.user);
      setAdmins(adminUsers);
      
      console.log(`✅ Загружено ${allMembers.length} участников чата`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(errorMessage);
      console.error('❌ Ошибка загрузки участников:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Поиск участников
  const searchMembers = useCallback((query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredMembers(members);
      return;
    }

    const filtered = members.filter(member => {
      const searchTerm = query.toLowerCase();
      const firstName = member.first_name?.toLowerCase() || '';
      const lastName = member.last_name?.toLowerCase() || '';
      const username = member.username?.toLowerCase() || '';
      const fullName = `${firstName} ${lastName}`.trim();

      return firstName.includes(searchTerm) ||
             lastName.includes(searchTerm) ||
             username.includes(searchTerm) ||
             fullName.includes(searchTerm);
    });

    setFilteredMembers(filtered);
  }, [members]);

  // Получить участников для выбора (с приоритетом администраторов)
  const getSelectableMembers = useCallback(() => {
    // Сначала администраторы, потом обычные участники
    const adminUsers = admins.filter(admin => !admin.is_bot);
    const regularUsers = members.filter(member => 
      !adminUsers.some(admin => admin.id === member.id) && 
      !member.is_bot
    );
    
    return [...adminUsers, ...regularUsers];
  }, [members, admins]);

  // Получить участника по ID
  const getMemberById = useCallback((id: number) => {
    return members.find(member => member.id === id);
  }, [members]);

  // Получить участника по username
  const getMemberByUsername = useCallback((username: string) => {
    return members.find(member => member.username === username);
  }, [members]);

  // Проверить, является ли участник администратором
  const isAdmin = useCallback((userId: number) => {
    return admins.some(admin => admin.id === userId);
  }, [admins]);

  // Получить отображаемое имя участника
  const getDisplayName = useCallback((member: TelegramUser) => {
    if (member.first_name && member.last_name) {
      return `${member.first_name} ${member.last_name}`;
    }
    return member.first_name || member.username || `User ${member.id}`;
  }, []);

  // Получить полное имя с username
  const getFullDisplayName = useCallback((member: TelegramUser) => {
    const displayName = getDisplayName(member);
    if (member.username) {
      return `${displayName} (@${member.username})`;
    }
    return displayName;
  }, [getDisplayName]);

  // Автоматическая загрузка при изменении chatId
  useEffect(() => {
    if (autoFetch && chatId) {
      fetchMembers(chatId);
    }
  }, [chatId, autoFetch, fetchMembers]);

  // Обновление отфильтрованных участников при изменении поиска
  useEffect(() => {
    searchMembers(searchQuery);
  }, [searchQuery, searchMembers]);

  return {
    // Состояние
    members,
    admins,
    filteredMembers,
    loading,
    error,
    searchQuery,
    
    // Действия
    fetchMembers,
    searchMembers,
    setSearchQuery,
    
    // Утилиты
    getSelectableMembers,
    getMemberById,
    getMemberByUsername,
    isAdmin,
    getDisplayName,
    getFullDisplayName,
    
    // Статистика
    totalMembers: members.length,
    totalAdmins: admins.length,
    filteredCount: filteredMembers.length,
  };
};
