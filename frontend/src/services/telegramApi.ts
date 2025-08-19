import axios from 'axios';

// Telegram Bot API конфигурация
const BOT_TOKEN = '8465643840:AAEWFjl1h-EY3150NgihSG2HAaVYLci14Rk';
const TELEGRAM_API_BASE = 'https://api.telegram.org';

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  is_bot: boolean;
  is_premium?: boolean;
  added_to_attachment_menu?: boolean;
  allows_sending_to_chats?: boolean;
}

export interface TelegramChatMember {
  user: TelegramUser;
  status: 'creator' | 'administrator' | 'member' | 'restricted' | 'left' | 'kicked';
  is_member: boolean;
  can_be_edited?: boolean;
  can_manage_chat?: boolean;
  can_delete_messages?: boolean;
  can_manage_video_chats?: boolean;
  can_restrict_members?: boolean;
  can_promote_members?: boolean;
  can_change_info?: boolean;
  can_invite_users?: boolean;
  can_post_messages?: boolean;
  can_edit_messages?: boolean;
  can_pin_messages?: boolean;
  can_post_stories?: boolean;
  can_edit_stories?: boolean;
  can_delete_stories?: boolean;
  can_manage_topics?: boolean;
}

export interface TelegramChat {
  id: number;
  type: 'private' | 'group' | 'supergroup' | 'channel';
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  is_forum?: boolean;
  active_usernames?: string[];
  emoji_status_custom_emoji_id?: string;
  has_hidden_members?: boolean;
  has_protected_content?: boolean;
  join_to_send_messages?: boolean;
  join_by_request?: boolean;
  has_private_forwards?: boolean;
  has_restricted_voice_and_video_messages?: boolean;
  is_scam?: boolean;
  is_fake?: boolean;
  slow_mode_delay?: number;
  message_auto_delete_time?: number;
  has_aggressive_anti_spam_enabled?: boolean;
  has_hidden_members?: boolean;
  has_protected_content?: boolean;
  sticker_set_name?: string;
  can_set_sticker_set?: boolean;
  linked_chat_id?: number;
  location?: any;
}

class TelegramApiService {
  private botToken: string;
  private apiBase: string;

  constructor() {
    this.botToken = BOT_TOKEN;
    this.apiBase = TELEGRAM_API_BASE;
  }

  // Получить информацию о боте
  async getBotInfo() {
    try {
      const response = await axios.get(`${this.apiBase}/bot${this.botToken}/getMe`);
      return response.data.result;
    } catch (error) {
      console.error('Ошибка получения информации о боте:', error);
      throw error;
    }
  }

  // Получить участников чата
  async getChatMembers(chatId: number | string): Promise<TelegramChatMember[]> {
    try {
      const response = await axios.get(
        `${this.apiBase}/bot${this.botToken}/getChatAdministrators?chat_id=${chatId}`
      );
      
      if (response.data.ok) {
        return response.data.result;
      } else {
        throw new Error(`Telegram API error: ${response.data.description}`);
      }
    } catch (error) {
      console.error('Ошибка получения участников чата:', error);
      throw error;
    }
  }

  // Получить информацию о чате
  async getChatInfo(chatId: number | string): Promise<TelegramChat> {
    try {
      const response = await axios.get(
        `${this.apiBase}/bot${this.botToken}/getChat?chat_id=${chatId}`
      );
      
      if (response.data.ok) {
        return response.data.result;
      } else {
        throw new Error(`Telegram API error: ${response.data.description}`);
      }
    } catch (error) {
      console.error('Ошибка получения информации о чате:', error);
      throw error;
    }
  }

  // Получить количество участников чата
  async getChatMemberCount(chatId: number | string): Promise<number> {
    try {
      const response = await axios.get(
        `${this.apiBase}/bot${this.botToken}/getChatMemberCount?chat_id=${chatId}`
      );
      
      if (response.data.ok) {
        return response.data.result;
      } else {
        throw new Error(`Telegram API error: ${response.data.description}`);
      }
    } catch (error) {
      console.error('Ошибка получения количества участников:', error);
      throw error;
    }
  }

  // Получить всех участников чата (постранично)
  async getAllChatMembers(chatId: number | string): Promise<TelegramUser[]> {
    try {
      const allMembers: TelegramUser[] = [];
      let offset = 0;
      const limit = 200; // Максимальное количество за один запрос

      while (true) {
        const response = await axios.get(
          `${this.apiBase}/bot${this.botToken}/getChatMembers?chat_id=${chatId}&offset=${offset}&limit=${limit}`
        );

        if (response.data.ok) {
          const members = response.data.result;
          if (members.length === 0) break;

          allMembers.push(...members.map((member: TelegramChatMember) => member.user));
          offset += members.length;

          if (members.length < limit) break;
        } else {
          throw new Error(`Telegram API error: ${response.data.description}`);
        }
      }

      return allMembers;
    } catch (error) {
      console.error('Ошибка получения всех участников чата:', error);
      throw error;
    }
  }

  // Поиск участников по имени или username
  async searchChatMembers(chatId: number | string, query: string): Promise<TelegramUser[]> {
    try {
      const allMembers = await this.getAllChatMembers(chatId);
      const searchQuery = query.toLowerCase();

      return allMembers.filter(member => {
        const firstName = member.first_name?.toLowerCase() || '';
        const lastName = member.last_name?.toLowerCase() || '';
        const username = member.username?.toLowerCase() || '';
        const fullName = `${firstName} ${lastName}`.trim();

        return firstName.includes(searchQuery) ||
               lastName.includes(searchQuery) ||
               username.includes(searchQuery) ||
               fullName.includes(searchQuery);
      });
    } catch (error) {
      console.error('Ошибка поиска участников:', error);
      throw error;
    }
  }

  // Получить участников для выбора (только администраторы и активные участники)
  async getSelectableMembers(chatId: number | string): Promise<TelegramUser[]> {
    try {
      const admins = await this.getChatMembers(chatId);
      const adminUsers = admins.map(admin => admin.user);

      // Добавляем обычных участников (можно настроить фильтрацию)
      const allMembers = await this.getAllChatMembers(chatId);
      const regularMembers = allMembers.filter(member => 
        !adminUsers.some(admin => admin.id === member.id) && 
        !member.is_bot
      );

      // Объединяем: сначала администраторы, потом обычные участники
      return [...adminUsers, ...regularMembers];
    } catch (error) {
      console.error('Ошибка получения участников для выбора:', error);
      throw error;
    }
  }
}

export const telegramApiService = new TelegramApiService();
export default telegramApiService;
