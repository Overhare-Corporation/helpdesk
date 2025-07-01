import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LucideAngularModule, Eye, EyeClosed } from 'lucide-angular';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { LoginResponse } from '../../models/login_response';
import { AuthService } from '../../auth/auth.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    NzIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading: boolean = false;
  passwordVisible: boolean = false;

  readonly Eye = Eye;

  readonly EyeClosed = EyeClosed;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private userService: UserService,
    private notificationService: NotificationService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false],
    });
  }

  onSubmit() {
    this.isLoading = true;
    if (this.loginForm.valid) {
      this.userService
        .login(
          this.loginForm.get('email')?.value,
          this.loginForm.get('password')?.value
        )
        .subscribe({
          next: (response: LoginResponse) => {
            this.auth.login(response.idToken);
            this.isLoading = false;
            this.router.navigate(['/panel/dashboard']);
          },
          error: (error: any) => {
            this.isLoading = false;
            this.notificationService.errorNotification(
              'Error',
              'Error al iniciar sesión ' + error.error.error.message,
            );
          },
        });
    }
  }

  ngOnInit(): void {}

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
