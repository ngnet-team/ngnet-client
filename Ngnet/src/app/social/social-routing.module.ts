import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../services/guards/auth-guard.service';
import { PostsComponent } from './posts/posts.component';

const routes: Routes = [
  {
    path: 'posts',
    pathMatch: 'full',
    component: PostsComponent, 
    canActivate: [ AuthGuardService ],
    data: {
      authRequired: true,
      redirectUrl: 'login'
    }
  },
];

export const SocialRoutingModule = RouterModule.forChild(routes);