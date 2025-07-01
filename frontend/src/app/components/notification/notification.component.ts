import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Bell, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [NzIconModule, NzButtonModule, LucideAngularModule],
  template: `
    <ng-template #template>
      <div class="ant-notification-notice-content">
        <div class="ant-notification-notice-with-icon">
          <span class="ant-notification-notice-icon">
          @if(icon !== ''){
            <img [src]="icon" alt="icon" class="ant-notification-notice-icon-img">
          }
          @else {
            <lucide-angular [img]="bell"></lucide-angular>
          }
          </span>
          <div class="ant-notification-notice-message">{{ title }}</div>
          <div class="ant-notification-notice-description">{{ message }}</div>
        </div>
      </div>
    </ng-template>
  `,
  styles: `
    .ant-notification-notice-icon-img{
      width: 24px;
      height: 24px;
    }
  `
})
export class NotificationComponent {
    @ViewChild('template') fireTemplate!: TemplateRef<any>;
    @Input() title: string = '';
    @Input() message: string = '';
    @Input() icon: string = '';
    @Input() data: any = {};

    bell = Bell;

    constructor(private notification: NzNotificationService) {}
}
