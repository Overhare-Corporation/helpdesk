import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, Eye, EyeClosed } from 'lucide-angular';
import { RouterOutlet } from '@angular/router';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ FormsModule, CommonModule, ReactiveFormsModule, LucideAngularModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  title = 'Helpdesk by Overhare';

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.setupPushNotifications();
  }

  private async setupPushNotifications() {
    try {
      this.notificationService.receiveMessage();
    } catch (err) {
      console.error('Error setting up push notifications:', err);
    }
  }
}
