import { useState } from 'react';

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName?: string;
  displayName: string;
  role: string;
  service?: string;
}

interface SearchUsersParams {
  query: string;
  chatIds?: string[];
  limit?: number;
}

interface ParsedMention {
  username: string;
  user?: User;
  position: { start: number; end: number };
}

export const useMentionUsers = () => {
  const [loading, setLoading] = useState(false);

  const searchUsers = async (params: SearchUsersParams): Promise<User[]> => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('query', params.query);
      if (params.chatIds) {
        params.chatIds.forEach(chatId => queryParams.append('chatIds', chatId));
      }
      if (params.limit) {
        queryParams.append('limit', params.limit.toString());
      }

      const response = await fetch(`/api/users/mentions/search?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to search users');
      }

      return response.json();
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getChatMembers = async (chatId: string): Promise<any[]> => {
    try {
      const response = await fetch(`/api/users/mentions/chat-members?chatId=${chatId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get chat members');
      }

      return response.json();
    } catch (error) {
      console.error('Error getting chat members:', error);
      return [];
    }
  };

  const parseMentions = async (text: string): Promise<{
    mentions: ParsedMention[];
    cleanText: string;
  }> => {
    try {
      const response = await fetch('/api/users/mentions/parse', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to parse mentions');
      }

      return response.json();
    } catch (error) {
      console.error('Error parsing mentions:', error);
      return { mentions: [], cleanText: text };
    }
  };

  const syncChatUsers = async (chatId: string): Promise<any[]> => {
    try {
      const response = await fetch('/api/users/mentions/sync-chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatId }),
      });

      if (!response.ok) {
        throw new Error('Failed to sync chat users');
      }

      return response.json();
    } catch (error) {
      console.error('Error syncing chat users:', error);
      throw error;
    }
  };

  return {
    searchUsers,
    getChatMembers,
    parseMentions,
    syncChatUsers,
    loading,
  };
};
