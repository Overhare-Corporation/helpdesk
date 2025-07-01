import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { UserService } from "../../services/user.service";
import { NzTableModule } from 'ng-zorro-antd/table';
import { CommonModule } from '@angular/common';

interface User {
  id: number;
  email: string;
  username: string;
  name: string | null;
  roles: string[];
}

interface TicketStatus {
  id: number;
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

interface Ticket {
  openedBy: string;
  ownTicket: string;
  providerTicket: string;
  assignedTo: string;
  requiredBy: string;
  ownStatus: TicketStatus;
  providerStatus: TicketStatus;
}

interface ApiResponse<T> {
  message: string;
  data: T;
}

interface PaginatedResponse<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

@Component({
  selector: 'app-dashboard',
  imports: [NavbarComponent, NzTableModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  users: User[] = [];
  tickets: Ticket[] = [];
  isLoadingUsers = true;
  isLoadingTickets = true;

  constructor(
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.loadUsers();
    this.loadTickets();
  }

  private loadUsers(): void {
    this.isLoadingUsers = true;
    this.userService.getUsers().subscribe({
      next: (response: ApiResponse<User[]>) => {
        console.log('Users fetched successfully:', response);
        this.users = response.data; // Acceder a la propiedad data
        this.isLoadingUsers = false;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.isLoadingUsers = false;
      }
    });
  }

  private loadTickets(): void {
    this.isLoadingTickets = true;
    this.userService.getTickets(0, 10).subscribe({
      next: (response: ApiResponse<PaginatedResponse<Ticket>>) => {
        console.log('Tickets fetched successfully:', response);
        this.tickets = response.data.content; // Acceder a data.content
        this.isLoadingTickets = false;
      },
      error: (error) => {
        console.error('Error fetching tickets:', error);
        this.isLoadingTickets = false;
      }
    });
  }
}
