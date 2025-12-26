import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { UserRegisterComponent } from './pages/register/register.component';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
import { authGuard } from '../auth.guard';
import { NewCampaignComponent } from './pages/new-campaign/new-campaign.component';
import { NewClientComponent } from './pages/new-client/new-client.component';

export const routes: Routes = [
  { path: '', component: LoginComponent, pathMatch: 'full' },
  {
    path: 'home',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./pages/register/register.component').then(m => m.UserRegisterComponent)
      },
      {
        path: 'nova-campanha',
        loadComponent: () => import('./pages/new-campaign/new-campaign.component').then(m => m.NewCampaignComponent)
      },
      {
        path: 'new-client',
        loadComponent: () => import('./pages/new-client/new-client.component').then(m => m.NewClientComponent)
      },
      { path: 'reports', 
        loadComponent: () => import('./pages/reports/reports.component').then(m => m.ReportsComponent) 
      },
      { path: 'settings', 
        loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent) 
      },
      { path: 'change-password',
        loadComponent: () => import('./pages/change-password/change-password.component').then(m => m.ChangePasswordComponent)
      }
    ]
  }
];

