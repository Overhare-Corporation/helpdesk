import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { UserService } from '../../services/user.service';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCardModule } from 'ng-zorro-antd/card';
import { CommonModule } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';

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

interface CreateTicketRequest {
  openedById: number;
  ownTicket: string;
  providerTicket: string;
  assignedToId: number;
  requiredBy: string;
  ownStatusId: number;
  providerStatusId: number;
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
  imports: [
    NavbarComponent,
    NzTableModule,
    CommonModule,
    NzFormModule,
    NzInputModule,
    NzIconModule,
    NzButtonModule,
    NzModalModule,
    NzSelectModule,
    NzCardModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  users: User[] = [];
  tickets: Ticket[] = [];
  ticketStatuses: TicketStatus[] = [];
  ticketForm: FormGroup;
  isVisible = false;
  isLoadingUsers = true;
  isLoadingTickets = true;
  isLoadingStatuses = false;
  isCreatingTicket = false;
  showCreateForm = false;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private message: NzMessageService
  ) {
    this.ticketForm = this.fb.group({
      ownTicket: ['', [Validators.required, Validators.minLength(3)]],
      providerTicket: ['', [Validators.required, Validators.minLength(3)]],
      requiredBy: ['', [Validators.required, Validators.minLength(2)]],
      openedById: [null, [Validators.required]],
      assignedToId: [null, [Validators.required]],
      ownStatusId: [null, [Validators.required]],
      providerStatusId: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadTickets();
  }

  private loadUsers(): void {
    this.isLoadingUsers = true;
    this.userService.getUsers().subscribe({
      next: (response: ApiResponse<User[]>) => {
        console.log('Users fetched successfully:', response);
        this.users = response.data;
        this.isLoadingUsers = false;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.message.error('Failed to load users');
        this.isLoadingUsers = false;
      },
    });
  }

  private loadTickets(): void {
    this.isLoadingTickets = true;
    this.userService.getTickets(0, 10).subscribe({
      next: (response: ApiResponse<PaginatedResponse<Ticket>>) => {
        console.log('Tickets fetched successfully:', response);
        this.tickets = response.data.content;
        this.isLoadingTickets = false;
      },
      error: (error) => {
        console.error('Error fetching tickets:', error);
        this.message.error('Failed to load tickets');
        this.isLoadingTickets = false;
      },
    });
  }

  private loadTicketStatuses(): void {
    if (this.ticketStatuses.length > 0) return; // Ya están cargados

    this.isLoadingStatuses = true;
    this.userService.getTicketStatuses().subscribe({
      next: (response: ApiResponse<TicketStatus[]>) => {
        this.ticketStatuses = response.data;
        this.isLoadingStatuses = false;
      },
      error: (error) => {
        console.error('Error fetching ticket statuses:', error);
        this.message.error('Failed to load ticket statuses');
        this.isLoadingStatuses = false;
      },
    });
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (this.showCreateForm) {
      this.loadTicketStatuses();
    }
  }

  resetForm(): void {
    this.ticketForm.reset();
    Object.keys(this.ticketForm.controls).forEach((key) => {
      this.ticketForm.get(key)?.setErrors(null);
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.ticketForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  private markFormGroupTouched(): void {
    Object.keys(this.ticketForm.controls).forEach((key) => {
      const control = this.ticketForm.get(key);
      control?.markAsTouched();
    });
  }

  // Lógica para crear el ticket
  onSubmitTicket(): void {
    if (this.ticketForm.valid) {
      this.isCreatingTicket = true;
      const formValue = this.ticketForm.value;
      const createTicketRequest: CreateTicketRequest = {
        openedById: formValue.openedById,
        ownTicket: formValue.ownTicket,
        providerTicket: formValue.providerTicket,
        assignedToId: formValue.assignedToId,
        requiredBy: formValue.requiredBy,
        ownStatusId: formValue.ownStatusId,
        providerStatusId: formValue.providerStatusId,
      };

      this.userService.createTicket(createTicketRequest).subscribe({
        next: () => {
          this.message.success('Ticket created successfully!');
          this.resetForm();
          this.loadTickets();
          this.isCreatingTicket = false;
        },
        error: () => {
          this.message.error('Failed to create ticket. Please try again.');
          this.isCreatingTicket = false;
        },
      });
    } else {
      this.message.warning('Please fill in all required fields correctly.');
    }
  }

  showModal(): void {
    this.isVisible = true;
    this.toggleCreateForm();
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
}
