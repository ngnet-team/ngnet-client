import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../services/guards/auth-guard.service';
import { ProfileResolverService } from '../services/components/profile/profile-resolver.service';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path: 'login',
    pathMatch: 'full',
    component: LoginComponent, 
    canActivate: [ AuthGuardService ],
    data: {
      authRequired: false,
      redirectUrl: 'home'
    }
  },
  {
    path: 'register',
    pathMatch: 'full',
    component: RegisterComponent, 
    canActivate: [ AuthGuardService ],
    data: {
      authRequired: false,
      redirectUrl: 'home'
    }
  },
  {
    path: 'profile',
    pathMatch: 'full',
    component: ProfileComponent, 
    resolve: { profile: ProfileResolverService },
    data: {
      authRequired: true,
      roleRequired: 'user',
      redirectUrl: 'login'
    },
    canActivate: [ AuthGuardService ],
  }
];

export const AuthRoutingModule = RouterModule.forChild(routes);