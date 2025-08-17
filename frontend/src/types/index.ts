export interface User {
  id: string;
  telegramId: string;
  firstName: string;
  lastName?: string;
  username?: string;
  role: UserRole;
  serviceId?: string;
  service?: Service;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
}

export interface Location {
  id: string;
  name: string;
  description?: string;
  serviceId: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  serviceId: string;
  locationId: string;
  createdById: string;
  assignedToId?: string;
  createdAt: string;
  updatedAt: string;
  assignedAt?: string;
  startedAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  slaDeadline?: string;
  
  // Relations
  service?: Service;
  location?: Location;
  createdBy?: User;
  assignedTo?: User;
  comments?: Comment[];
  attachments?: Attachment[];
  tags?: TicketTag[];
}

export interface Comment {
  id: string;
  content: string;
  ticketId: string;
  userId: string;
  createdAt: string;
  user?: User;
}

export interface Attachment {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  kind: AttachmentKind;
  telegramFileId?: string;
  minioPath: string;
  ticketId: string;
  userId: string;
  createdAt: string;
  user?: User;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface TicketTag {
  id: string;
  ticketId: string;
  tagId: string;
  tag: Tag;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  userId: string;
  ticketId?: string;
  isRead: boolean;
  channels: NotificationChannel[];
  createdAt: string;
}

export interface UserPreferences {
  id: string;
  userId: string;
  notificationChannels: NotificationChannel[];
  quietHoursStart?: string;
  quietHoursEnd?: string;
  digestFrequency: string;
  timezone: string;
  language: string;
}

export enum UserRole {
  EMPLOYEE = 'EMPLOYEE',
  EXECUTOR = 'EXECUTOR',
  SERVICE_LEADER = 'SERVICE_LEADER',
  ADMIN = 'ADMIN',
}

export enum TicketStatus {
  NEW = 'NEW',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum AttachmentKind {
  PROBLEM_BEFORE = 'PROBLEM_BEFORE',
  RESULT_AFTER = 'RESULT_AFTER',
  OTHER = 'OTHER',
}

export enum NotificationType {
  ASSIGNED = 'ASSIGNED',
  STATUS_CHANGED = 'STATUS_CHANGED',
  COMMENT_ADDED = 'COMMENT_ADDED',
  ATTACHMENT_ADDED = 'ATTACHMENT_ADDED',
  SLA_WARNING = 'SLA_WARNING',
  SLA_BREACH = 'SLA_BREACH',
}

export enum NotificationChannel {
  TELEGRAM = 'TELEGRAM',
  IN_APP = 'IN_APP',
  BOTH = 'BOTH',
}
