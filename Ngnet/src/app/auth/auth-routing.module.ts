import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../services/guards/auth-guard.service';
import { NotLoggedGuardService } from '../services/guards/not-logged-guard.service';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path: 'login',
    pathMatch: 'full',
    component: LoginComponent, 
    canActivate: [ NotLoggedGuardService ]
  },
  {
    path: 'register',
    pathMatch: 'full',
    component: RegisterComponent, 
    canActivate: [ NotLoggedGuardService ]
  },
  {
    path: 'profile',
    pathMatch: 'full',
    component: ProfileComponent, 
    canActivate: [ AuthGuardService ]
  }
];

export const UserRoutingModule = RouterModule.forChild(routes);