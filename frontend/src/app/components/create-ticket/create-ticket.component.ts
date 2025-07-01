import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserService } from '../../services/user.service';

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

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule
  ],
  template: `
    <div class="create-ticket-container">
      <h2>Create New Ticket</h2>

      <form nz-form [formGroup]="ticketForm" (ngSubmit)="onSubmit()" [nzLayout]="'vertical'">

        <!-- Own Ticket ID -->
        <nz-form-item>
          <nz-form-label [nzRequired]="true">Own Ticket ID</nz-form-label>
          <nz-form-control nzErrorTip="Please enter the own ticket ID">
            <input
              nz-input
              formControlName="ownTicket"
              placeholder="e.g., R-19123"
              [class.error]="isFieldInvalid('ownTicket')"
            />
          </nz-form-control>
        </nz-form-item>

        <!-- Provider Ticket ID -->
        <nz-form-item>
          <nz-form-label [nzRequired]="true">Provider Ticket ID</nz-form-label>
          <nz-form-control nzErrorTip="Please enter the provider ticket ID">
            <input
              nz-input
              formControlName="providerTicket"
              placeholder="e.g., I-00123"
              [class.error]="isFieldInvalid('providerTicket')"
            />
          </nz-form-control>
        </nz-form-item>

        <!-- Required By -->
        <nz-form-item>
          <nz-form-label [nzRequired]="true">Required By</nz-form-label>
          <nz-form-control nzErrorTip="Please enter who requires this ticket">
            <input
              nz-input
              formControlName="requiredBy"
              placeholder="e.g., Juan"
              [class.error]="isFieldInvalid('requiredBy')"
            />
          </nz-form-control>
        </nz-form-item>

        <!-- Opened By -->
        <nz-form-item>
          <nz-form-label [nzRequired]="true">Opened By</nz-form-label>
          <nz-form-control nzErrorTip="Please select who opened this ticket">
            <nz-select
              formControlName="openedById"
              nzPlaceHolder="Select user"
              [nzLoading]="isLoadingUsers"
              [class.error]="isFieldInvalid('openedById')"
            >
              @for (user of users; track user.id) {
                <nz-option [nzValue]="user.id" [nzLabel]="user.email"></nz-option>
              }
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <!-- Assigned To -->
        <nz-form-item>
          <nz-form-label [nzRequired]="true">Assigned To</nz-form-label>
          <nz-form-control nzErrorTip="Please select who this ticket is assigned to">
            <nz-select
              formControlName="assignedToId"
              nzPlaceHolder="Select user"
              [nzLoading]="isLoadingUsers"
              [class.error]="isFieldInvalid('assignedToId')"
            >
              @for (user of users; track user.id) {
                <nz-option [nzValue]="user.id" [nzLabel]="user.email"></nz-option>
              }
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <!-- Own Status -->
        <nz-form-item>
          <nz-form-label [nzRequired]="true">Own Status</nz-form-label>
          <nz-form-control nzErrorTip="Please select the own status">
            <nz-select
              formControlName="ownStatusId"
              nzPlaceHolder="Select status"
              [nzLoading]="isLoadingStatuses"
              [class.error]="isFieldInvalid('ownStatusId')"
            >
              @for (status of ticketStatuses; track status.id) {
                <nz-option [nzValue]="status.id">
                  <span [style.color]="status.color">{{ status.name }}</span>
                  <small style="margin-left: 8px; color: #666;">{{ status.description }}</small>
                </nz-option>
              }
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <!-- Provider Status -->
        <nz-form-item>
          <nz-form-label [nzRequired]="true">Provider Status</nz-form-label>
          <nz-form-control nzErrorTip="Please select the provider status">
            <nz-select
              formControlName="providerStatusId"
              nzPlaceHolder="Select status"
              [nzLoading]="isLoadingStatuses"
              [class.error]="isFieldInvalid('providerStatusId')"
            >
              @for (status of ticketStatuses; track status.id) {
                <nz-option [nzValue]="status.id">
                  <span [style.color]="status.color">{{ status.name }}</span>
                  <small style="margin-left: 8px; color: #666;">{{ status.description }}</small>
                </nz-option>
              }
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <!-- Submit Button -->
        <nz-form-item>
          <nz-form-control>
            <button
              nz-button
              nzType="primary"
              [nzLoading]="isCreatingTicket"
              [disabled]="!ticketForm.valid"
              type="submit"
            >
              Create Ticket
            </button>
            <button
              nz-button
              type="button"
              (click)="resetForm()"
              style="margin-left: 8px;"
              [disabled]="isCreatingTicket"
            >
              Reset
            </button>
          </nz-form-control>
        </nz-form-item>

      </form>
    </div>
  `,
  styles: [`
    .create-ticket-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 24px;
    }

    .error {
      border-color: #ff4d4f !important;
    }

    h2 {
      margin-bottom: 24px;
      text-align: center;
    }
  `]
})
export class CreateTicketComponent implements OnInit {
  ticketForm: FormGroup;
  users: User[] = [];
  ticketStatuses: TicketStatus[] = [];

  isLoadingUsers = false;
  isLoadingStatuses = false;
  isCreatingTicket = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private message: NzMessageService
  ) {
    this.ticketForm = this.fb.group({
      ownTicket: ['', [Validators.required, Validators.minLength(3)]],
      providerTicket: ['', [Validators.required, Validators.minLength(3)]],
      requiredBy: ['', [Validators.required, Validators.minLength(2)]],
      openedById: [null, [Validators.required]],
      assignedToId: [null, [Validators.required]],
      ownStatusId: [null, [Validators.required]],
      providerStatusId: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadTicketStatuses();
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
        this.message.error('Failed to load users');
        this.isLoadingUsers = false;
      }
    });
  }

  private loadTicketStatuses(): void {
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
      }
    });
  }

  onSubmit(): void {
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
        providerStatusId: formValue.providerStatusId
      };

      this.userService.createTicket(createTicketRequest).subscribe({
        next: (response) => {
          console.log('Ticket created successfully:', response);
          this.message.success('Ticket created successfully!');
          this.resetForm();
          this.isCreatingTicket = false;
        },
        error: (error) => {
          console.error('Error creating ticket:', error);
          this.message.error('Failed to create ticket. Please try again.');
          this.isCreatingTicket = false;
        }
      });
    } else {
      this.markFormGroupTouched();
      this.message.warning('Please fill in all required fields correctly.');
    }
  }

  resetForm(): void {
    this.ticketForm.reset();
    Object.keys(this.ticketForm.controls).forEach(key => {
      this.ticketForm.get(key)?.setErrors(null);
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.ticketForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  private markFormGroupTouched(): void {
    Object.keys(this.ticketForm.controls).forEach(key => {
      const control = this.ticketForm.get(key);
      control?.markAsTouched();
    });
  }
}
