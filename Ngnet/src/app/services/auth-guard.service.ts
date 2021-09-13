import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService, private route: Router, private router: ActivatedRoute) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const { authRequired, redirectUrl, roleRequired } = route.data;

    if (this.authorized(authRequired, roleRequired)) {
      return true
    }

    const url = redirectUrl ? redirectUrl : 'login';
    this.route.navigate([url]);
    return false;
  }

  private authorized(authRequired: boolean | undefined, roleRequired: string | undefined): boolean {

    if (authRequired === undefined) {
      return true;
    }

    if (authRequired !== this.authService.isLogged) {
      return false;
    }

    if (roleRequired === undefined) {
      return true;
    }

    //TODO: compare real role to the required one!
    return true;
  }
}
