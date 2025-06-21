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
      { path: '', component: HomeComponent },
      { path: 'register', component: UserRegisterComponent },
      { path: 'nova-campanha', component: NewCampaignComponent },
      { path: 'new-client', component: NewClientComponent },
    ]
  }
];
