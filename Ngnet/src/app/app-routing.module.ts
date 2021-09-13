import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { HomeComponent } from './home/home.component';
import { AuthGuardService } from './services/auth-guard.service';
import { ProfileResolverService } from './services/profile-resolver.service';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { ServerNotFoundComponent } from './shared/server-not-found/server-not-found.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: HomeComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'home',
        pathMatch: 'full',
        redirectTo: ''
    },
    {
        path: 'admin',
        pathMatch: 'full',
        component: AdminComponent,
        resolve: { profile: ProfileResolverService },
        canActivate: [AuthGuardService],
        data: {
            authRequired: true,
            requiredRole: 'Admin',
        },
    },
    //Must be the last route!
    {
        path: 'server-not-found',
        pathMatch: 'full',
        component: ServerNotFoundComponent
    },
    {
        path: '**',
        component: NotFoundComponent
    },
    {
        path: 'not-found',
        pathMatch: 'full',
        redirectTo: '**'
    }
];

export const AppRoutingModule = RouterModule.forRoot(routes);
