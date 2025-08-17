import { create } from 'zustand';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  tags?: string[];
}

interface TicketStore {
  tickets: Ticket[];
  isLoading: boolean;
  error: string | null;
  fetchTickets: () => Promise<void>;
  createTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTicket: (id: string, updates: Partial<Ticket>) => Promise<void>;
  deleteTicket: (id: string) => Promise<void>;
}

export const useTicketStore = create<TicketStore>((set, get) => ({
  tickets: [],
  isLoading: false,
  error: null,
  fetchTickets: async () => {
    set({ isLoading: true, error: null });
    try {
      // Здесь будет API вызов
      const mockTickets: Ticket[] = [
        {
          id: '1',
          title: 'Не работает аттракцион',
          description: 'Аттракцион "Колесо обозрения" не запускается',
          status: 'open',
          priority: 'high',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: ['аттракцион', 'техника']
        }
      ];
      set({ tickets: mockTickets, isLoading: false });
    } catch (error) {
      set({ error: 'Ошибка загрузки заявок', isLoading: false });
    }
  },
  createTicket: async (ticket) => {
    set({ isLoading: true, error: null });
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
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Ошибка создания заявки', isLoading: false });
    }
  },
  updateTicket: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      // Здесь будет API вызов
      set((state) => ({
        tickets: state.tickets.map((ticket) =>
          ticket.id === id
            ? { ...ticket, ...updates, updatedAt: new Date().toISOString() }
            : ticket
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Ошибка обновления заявки', isLoading: false });
    }
  },
  deleteTicket: async (id) => {
    set({ isLoading: true, error: null });
    try {
      // Здесь будет API вызов
      set((state) => ({
        tickets: state.tickets.filter((ticket) => ticket.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Ошибка удаления заявки', isLoading: false });
    }
  },
}));
