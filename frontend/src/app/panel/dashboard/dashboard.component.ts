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
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import {
  User,
  Ticket,
  TicketStatus,
  CreateTicketRequest,
  UpdateTicketRequest,
  UpdateUserRequest,
  ApiResponse,
  PaginatedResponse
} from '../../models/dashboard';

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
    NzPopconfirmModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  users: User[] = [];
  tickets: Ticket[] = [];
  ticketStatuses: TicketStatus[] = [];
  ticketForm: FormGroup;
  userForm: FormGroup;

  // Estados de carga y visibilidad
  isVisible = false;
  isUserModalVisible = false;
  isLoadingUsers = true;
  isLoadingTickets = true;
  isLoadingStatuses = false;
  isCreatingTicket = false;
  isUpdatingTicket = false;
  isUpdatingUser = false;
  isDeletingTicket = false;
  showCreateForm = false;

  // Estados de edición
  isEditMode = false;
  isUserEditMode = false;
  currentTicketId: string | null = null;
  currentUserId: string | null = null;

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

    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
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
        this.users = response.data;
        this.isLoadingUsers = false;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.message.error('Error al cargar usuarios');
        this.isLoadingUsers = false;
      },
    });
  }

  private loadTickets(): void {
    this.isLoadingTickets = true;
    this.userService.getTickets(0, 10).subscribe({
      next: (response: ApiResponse<PaginatedResponse<Ticket>>) => {
        this.tickets = response.data.content;
        this.isLoadingTickets = false;
      },
      error: (error) => {
        console.error('Error fetching tickets:', error);
        this.message.error('Error al cargar tickets');
        this.isLoadingTickets = false;
      },
    });
  }

  private loadTicketStatuses(): void {
    if (this.ticketStatuses.length > 0) return;

    this.isLoadingStatuses = true;
    this.userService.getTicketStatuses().subscribe({
      next: (response: ApiResponse<TicketStatus[]>) => {
        this.ticketStatuses = response.data;
        this.isLoadingStatuses = false;
      },
      error: (error) => {
        console.error('Error fetching ticket statuses:', error);
        this.message.error('Error al cargar estados de ticket');
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
    this.isEditMode = false;
    this.currentTicketId = null;
    Object.keys(this.ticketForm.controls).forEach((key) => {
      this.ticketForm.get(key)?.setErrors(null);
    });
  }

  resetUserForm(): void {
    this.userForm.reset();
    this.isUserEditMode = false;
    this.currentUserId = null;
    Object.keys(this.userForm.controls).forEach((key) => {
      this.userForm.get(key)?.setErrors(null);
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.ticketForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isUserFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  private markFormGroupTouched(): void {
    Object.keys(this.ticketForm.controls).forEach((key) => {
      const control = this.ticketForm.get(key);
      control?.markAsTouched();
    });
  }

  private markUserFormGroupTouched(): void {
    Object.keys(this.userForm.controls).forEach((key) => {
      const control = this.userForm.get(key);
      control?.markAsTouched();
    });
  }

  // ============ MÉTODOS PARA TICKETS ============

  onSubmitTicket(): void {
    if (this.ticketForm.valid) {
      if (this.isEditMode && this.currentTicketId) {
        this.updateTicket();
      } else {
        this.createTicket();
      }
    } else {
      this.message.warning('Por favor complete todos los campos requeridos correctamente.');
      this.markFormGroupTouched();
    }
  }

  private createTicket(): void {
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
        this.message.success('¡Ticket creado exitosamente!');
        this.resetForm();
        this.loadTickets();
        this.isCreatingTicket = false;
        this.isVisible = false;
      },
      error: (error) => {
        console.error('Error creating ticket:', error);
        this.message.error('Error al crear el ticket. Por favor intente nuevamente.');
        this.isCreatingTicket = false;
      },
    });
  }

  private updateTicket(): void {
    if (!this.currentTicketId) return;

    this.isUpdatingTicket = true;
    const formValue = this.ticketForm.value;
    const updateTicketRequest: UpdateTicketRequest = {
      openedById: formValue.openedById,
      ownTicket: formValue.ownTicket,
      providerTicket: formValue.providerTicket,
      assignedToId: formValue.assignedToId,
      requiredBy: formValue.requiredBy,
      ownStatusId: formValue.ownStatusId,
      providerStatusId: formValue.providerStatusId,
    };

    this.userService.updateTicket(this.currentTicketId, updateTicketRequest).subscribe({
      next: () => {
        this.message.success('¡Ticket actualizado exitosamente!');
        this.resetForm();
        this.loadTickets();
        this.isUpdatingTicket = false;
        this.isVisible = false;
      },
      error: (error) => {
        console.error('Error updating ticket:', error);
        this.message.error('Error al actualizar el ticket. Por favor intente nuevamente.');
        this.isUpdatingTicket = false;
      },
    });
  }

  deleteTicket(ticketUuid: string): void {
    this.isDeletingTicket = true;
    this.currentTicketId = ticketUuid;
    this.userService.deleteTicket(ticketUuid).subscribe({
      next: () => {
        this.message.success('¡Ticket eliminado exitosamente!');
        this.loadTickets();
        this.isDeletingTicket = false;
      },
      error: (error) => {
        console.error('Error deleting ticket:', error);
        this.message.error('Error al eliminar el ticket. Por favor intente nuevamente.');
        this.isDeletingTicket = false;
      },
    });
  }

  editTicket(ticket: Ticket): void {
    this.isEditMode = true;
    this.currentTicketId = ticket.uuid;
    this.loadTicketStatuses();

    const openedByUser = this.users.find(user => user.email === ticket.openedBy || user.username === ticket.openedBy);
    const assignedToUser = this.users.find(user => user.email === ticket.assignedTo || user.username === ticket.assignedTo);

    this.ticketForm.patchValue({
      ownTicket: ticket.ownTicket,
      providerTicket: ticket.providerTicket,
      requiredBy: ticket.requiredBy,
      openedById: openedByUser?.uuid || ticket.openedById,
      assignedToId: assignedToUser?.uuid || ticket.assignedToId,
      ownStatusId: ticket.ownStatus.uuid,
      providerStatusId: ticket.providerStatus.uuid,
    });

    this.isVisible = true;
          console.log('Form value:', this.ticketForm.value);
          console.log('Current ticket ID:', this.currentTicketId);

  }

  // ============ MÉTODOS PARA USUARIOS ============

  editUser(user: User): void {
    this.isUserEditMode = true;
    this.currentUserId = user.uuid;

    this.userForm.patchValue({
      name: user.name || ''
    });

    this.isUserModalVisible = true;
  }

  onSubmitUser(): void {
    if (this.userForm.valid) {
      this.updateUser();
    } else {
      this.message.warning('Por favor complete todos los campos requeridos correctamente.');
      this.markUserFormGroupTouched();
    }
  }

  private updateUser(): void {
    if (!this.currentUserId) return;

    this.isUpdatingUser = true;
    const formValue = this.userForm.value;
    const updateUserRequest: UpdateUserRequest = {
      email: formValue.email,
      username: formValue.username,
      name: formValue.name,
      roles: formValue.roles,
    };

    this.userService.updateUser(this.currentUserId, updateUserRequest).subscribe({
      next: () => {
        this.message.success('¡Usuario actualizado exitosamente!');
        this.resetUserForm();
        this.loadUsers();
        this.isUpdatingUser = false;
        this.isUserModalVisible = false;
      },
      error: (error) => {
        console.error('Error updating user:', error);
        this.message.error('Error al actualizar el usuario. Por favor intente nuevamente.');
        this.isUpdatingUser = false;
      },
    });
  }

  // ============ MÉTODOS PARA MODALES ============

  showModal(): void {
    this.resetForm();
    this.isVisible = true;
    this.toggleCreateForm();
  }

  handleOk(): void {
          console.log('Form value:', this.ticketForm.value);

    this.onSubmitTicket();
  }

  handleCancel(): void {
    this.resetForm();
    this.isVisible = false;
  }

  handleUserOk(): void {
    this.onSubmitUser();
  }

  handleUserCancel(): void {
    this.resetUserForm();
    this.isUserModalVisible = false;
  }

  // ============ GETTERS ============

  get submitButtonText(): string {
    if (this.isEditMode) {
      return this.isUpdatingTicket ? 'Actualizando...' : 'Actualizar Ticket';
    }
    return this.isCreatingTicket ? 'Creando...' : 'Crear Ticket';
  }

  get userSubmitButtonText(): string {
    return this.isUpdatingUser ? 'Actualizando...' : 'Actualizar Usuario';
  }

  get isSubmitting(): boolean {
    return this.isCreatingTicket || this.isUpdatingTicket;
  }

  get modalTitle(): string {
    return this.isEditMode ? 'Editar Ticket' : 'Crear Nuevo Ticket';
  }

  get userModalTitle(): string {
    return 'Editar Usuario';
  }
}
