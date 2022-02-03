import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../services/guards/auth-guard.service';
import { AdminComponent } from './admin/admin.component';
import { OwnerComponent } from './owner/owner.component';

const routes: Routes = [
  {
    path: 'admin',
    pathMatch: 'full',
    component: AdminComponent, 
    canActivate: [ AuthGuardService ],
    data: {
      authRequired: true,
      redirectUrl: 'login',
      roleRequired: 'admin'
    }
  },
  {
    path: 'owner',
    pathMatch: 'full',
    component: OwnerComponent, 
    canActivate: [ AuthGuardService ],
    data: {
      authRequired: true,
      redirectUrl: 'login',
      roleRequired: 'owner'
    }
  }
];

export const DashboardRoutingModule = RouterModule.forChild(routes);