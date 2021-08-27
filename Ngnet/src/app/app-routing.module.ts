import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuardService } from './services/guards/auth-guard.service';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: HomeComponent,
        canActivate: [ AuthGuardService ]
    },
    {
        path: 'home',
        pathMatch: 'full',
        redirectTo: ''
    },
];

export const AppRoutingModule = RouterModule.forRoot(routes);
