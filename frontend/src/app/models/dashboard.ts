export interface User {
  uuid: string;
  email: string;
  username: string;
  name: string | null;
  roles: string[];
}

export interface TicketStatus {
  uuid: string;
  name: string;
  description: string;
  color: string;
  order: number;
  isActive: boolean;
  createdBy: string;
  updatedBy: string | null;
  deactivatedBy: string | null;
  createdAt: string;
  updatedAt: string | null;
  deactivatedAt: string | null;
}

export interface Ticket {
  uuid: string;
  openedBy: string;
  ownTicket: string;
  providerTicket: string;
  assignedTo: string;
  requiredBy: string;
  ownStatus: TicketStatus;
  providerStatus: TicketStatus;
  openedById?: string;
  assignedToId?: string;
}

export interface CreateTicketRequest {
  openedById: string;
  ownTicket: string;
  providerTicket: string;
  assignedToId: string;
  requiredBy: string;
  ownStatusId: string;
  providerStatusId: string;
}

export interface UpdateTicketRequest {
  openedById: string;
  ownTicket: string;
  providerTicket: string;
  assignedToId: string;
  requiredBy: string;
  ownStatusId: string;
  providerStatusId: string;
}

export interface UpdateUserRequest {
  email: string;
  username: string;
  name: string;
  roles: string[];
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}
