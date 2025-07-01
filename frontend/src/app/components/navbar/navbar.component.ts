import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import {
  LucideAngularModule,
  Bell,
  User,
  House,
  BookOpen,
  Trophy,
  Settings,
  LogOut,
} from 'lucide-angular';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzLayoutModule,
    NzMenuModule,
    NzDropDownModule,
    NzBadgeModule,
    NzIconModule,
    NzButtonModule,
    NzAvatarModule,
    NzSegmentedModule,
    LucideAngularModule,
    NzAffixModule,
  ],
  template: `
    <nz-affix [nzOffsetTop]="offsetTop">
      <div class="bg-white shadow-lg w-full">
        <div
          class="flex items-center justify-center md:justify-between md:mr-10 md:ml-10 ml-2 mr-2 gap-2 flex-wrap"
        >
          <div class="flex items-center justify-start">
            <img
              src="https://www.adsgt.com/adsgt.svg"
              alt="overhare"
              class="h-10 w-10"
            />
            <span class="text-lg font-bold ml-2">Helpdesk</span>
          </div>
          <div class="space-x-4 mb-6 mt-6 flex md:gap-28 gap-5">
            <!-- <a class="flex flex-row items-center gap-2" routerLink="dashboard">
              <lucide-angular [img]="House" class="my-icon"></lucide-angular>
              <span>Dashboard</span>
            </a>
            <a class="flex flex-row items-center gap-2" routerLink="cursos">
              <lucide-angular [img]="BookOpen" class="my-icon"></lucide-angular>
              <span>Cursos</span>
            </a>
            <a class="flex flex-row items-center gap-2" routerLink="logros">
              <lucide-angular [img]="Trophy" class="my-icon"></lucide-angular>
              <span>Logros</span>
            </a> -->
            <span class="text-xl font-bold text-gray-800">Panel de Control</span>
          </div>
          <nz-button-group>
            <button
              nz-button
              nz-dropdown
              [nzDropdownMenu]="userNotification"
              nzTrigger="click"
              style="border: none;"
            >
              <!-- <lucide-angular [img]="Bell" class="my-icon"></lucide-angular> -->
            </button>
            <button
              nz-button
              nz-dropdown
              [nzDropdownMenu]="userMenu"
              nzTrigger="click"
              style="border: none;"
            >
              <lucide-angular [img]="User" class="my-icon"></lucide-angular>
            </button>
          </nz-button-group>
        </div>
      </div>
      <nz-dropdown-menu #userMenu="nzDropdownMenu">
        <ul nz-menu>
          <div class="header flex items-center justify-start">
            <div class="flex items-center justify-start ml-3">
              <span class="font-bold">Mi Cuenta</span>
            </div>
          </div>
          <li nz-menu-item>
            <a
              class="flex flex-row justify-start items-center gap-3"
              routerLink="perfil"
            >
              <lucide-angular [img]="User" class="my-icon"></lucide-angular>
              Perfil
            </a>
          </li>
          <li nz-menu-item>
            <a
              routerLink="ajustes"
              class="flex flex-row justify-start items-center gap-3"
            >
              <lucide-angular [img]="Settings" class="my-icon"></lucide-angular>
              Configuración
            </a>
          </li>
          <li nz-menu-item>
            <a
              class="flex flex-row justify-start items-center gap-3"
              (click)="LogOutSession()"
            >
              <lucide-angular [img]="LogOut" class="my-icon"></lucide-angular>
              Cerrar sesión</a
            >
          </li>
        </ul>
      </nz-dropdown-menu>
      <nz-dropdown-menu #userNotification="nzDropdownMenu">
        <ul nz-menu>
          <div class="header flex items-center justify-center">
            <div class="flex items-center justify-between">
              <span class="font-bold">Notificaciones</span>
            </div>
          </div>
          <div class="footer flex items-center justify-center">
            <button
              routerLink="/panel/notificaciones"
              class="mr-4 ml-4 pt-1 pb-1 w-full mt-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Ver todas
            </button>
          </div>
        </ul>
      </nz-dropdown-menu>
    </nz-affix>
  `,
  styles: [
    `
      nz-header {
        padding: 0;
        height: 64px;
        line-height: 64px;
      }
      [nz-menu] {
        line-height: 64px;
      }
      nz-badge {
        margin-right: 20px;
      }
    `,
  ],
})
export class NavbarComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  Bell = Bell;
  User = User;
  House = House;
  BookOpen = BookOpen;
  Trophy = Trophy;
  Settings = Settings;
  LogOut = LogOut;
  index = 0;
  options = [
    { label: 'Dashboard', value: 'Dashboard', icon: 'home' },
    { label: 'Cursos', value: 'Cursos', icon: 'read' },
    { label: 'Logros', value: 'Logros', icon: 'trophy' },
  ];
  handleIndexChange(e: number): void {
    this.index = e;
  }

  onChange(status: boolean): void {}
  offsetTop = 0;
  nzOffsetBottom = 10;

  setOffsetTop(): void {
    this.offsetTop += 10;
  }

  setOffsetBottom(): void {
    this.nzOffsetBottom += 10;
  }

  LogOutSession() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {}
}
