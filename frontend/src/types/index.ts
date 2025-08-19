export interface User {
  id: string;
  telegramId: number;
  username?: string;
  firstName: string;
  lastName?: string;
  telegramUsername?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category?: string;
  assignedTo?: User;
  assignedToId?: string;
  createdBy: User;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  userId: string;
  ticketId?: string;
  createdAt: Date;
}

export enum UserRole {
  EMPLOYEE = 'EMPLOYEE',
  EXECUTOR = 'EXECUTOR',
  SERVICE_LEADER = 'SERVICE_LEADER',
  ADMIN = 'ADMIN'
}

export enum TicketStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  WAITING_FOR_CUSTOMER = 'waiting_for_customer',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum NotificationType {
  TICKET_ASSIGNED = 'ticket_assigned',
  TICKET_UPDATED = 'ticket_updated',
  TICKET_MENTIONED = 'ticket_mentioned',
  SYSTEM = 'system'
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  priority: TicketPriority;
  category?: string;
  assignedToId?: string;
}

export interface UpdateTicketRequest {
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: string;
  assignedToId?: string;
}
