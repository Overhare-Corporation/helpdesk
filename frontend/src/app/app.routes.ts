import { Routes } from '@angular/router';
import { panelRoutes } from './panel/panel.routes';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './auth/auth.guard';
import { DashboardComponent } from './panel/dashboard/dashboard.component';

export const routes: Routes = [
  {path: "panel", loadChildren: () => import("./panel/panel.routes").then(m => m.panelRoutes), canActivate: [authGuard], component: DashboardComponent},
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
