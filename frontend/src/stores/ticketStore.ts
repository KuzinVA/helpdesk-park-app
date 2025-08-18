import { create } from 'zustand';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'new' | 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  assignee?: { firstName: string; lastName?: string };
  category?: string;
  tags?: string[];
}

interface TicketStore {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
  fetchTickets: () => Promise<void>;
  createTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTicket: (id: string, updates: Partial<Ticket>) => Promise<void>;
  deleteTicket: (id: string) => Promise<void>;
}

export const useTicketStore = create<TicketStore>((set, get) => ({
  tickets: [],
  loading: false,
  error: null,
  fetchTickets: async () => {
    set({ loading: true, error: null });
    try {
      // Здесь будет API вызов
      const mockTickets: Ticket[] = [
        {
          id: '1',
          title: 'Не работает аттракцион',
          description: 'Аттракцион "Колесо обозрения" не запускается',
          status: 'new',
          priority: 'high',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          assignee: { firstName: 'Иван', lastName: 'Механик' },
          category: 'Техника',
          tags: ['аттракцион', 'техника']
        }
      ];
      set({ tickets: mockTickets, loading: false });
    } catch (error) {
      set({ error: 'Ошибка загрузки заявок', loading: false });
    }
  },
  createTicket: async (ticket) => {
    set({ loading: true, error: null });
    try {
      // Здесь будет API вызов
      const newTicket: Ticket = {
        ...ticket,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      set((state) => ({
        tickets: [...state.tickets, newTicket],
        loading: false
      }));
    } catch (error) {
      set({ error: 'Ошибка создания заявки', loading: false });
    }
  },
  updateTicket: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      // Здесь будет API вызов
      set((state) => ({
        tickets: state.tickets.map((ticket) =>
          ticket.id === id
            ? { ...ticket, ...updates, updatedAt: new Date().toISOString() }
            : ticket
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: 'Ошибка обновления заявки', loading: false });
    }
  },
  deleteTicket: async (id) => {
    set({ loading: true, error: null });
    try {
      // Здесь будет API вызов
      set((state) => ({
        tickets: state.tickets.filter((ticket) => ticket.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: 'Ошибка удаления заявки', loading: false });
    }
  },
}));
