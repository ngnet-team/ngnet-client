import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { isAuthorized } from 'src/app/interfaces/auth/authorized';
import { AuthService } from '../modules/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const { authRequired, redirectUrl, roleRequired } = route.data;

    if (authRequired === undefined) { return true; }

    if (authRequired && this.authService.user === undefined) { return false; }

    if (!this.authorized(roleRequired)) {
      const url = redirectUrl ? redirectUrl : 'login';
      this.router.navigate([url]);
      return false;
    }

    return true;
  }

  private authorized(roleRequired: string | undefined): boolean {
    if (roleRequired === undefined) {
      return true;
    }

    if (!isAuthorized(roleRequired, this.authService.user)) {
      return true;
    }

    return true;
  }
}
