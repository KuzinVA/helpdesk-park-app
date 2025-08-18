export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  assignee?: { firstName: string; lastName?: string };
  category?: string;
  tags?: string[];
  location?: string;
  attachments?: string[];
}

export type TicketStatus = 'new' | 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

export interface CreateTicketRequest {
  title: string;
  description: string;
  priority: TicketPriority;
  location?: string;
  tags?: string[];
}

export interface UpdateTicketRequest {
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedTo?: string;
  tags?: string[];
  location?: string;
}
