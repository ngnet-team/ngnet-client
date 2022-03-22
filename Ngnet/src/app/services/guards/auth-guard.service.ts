import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  private url: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const { authRequired, redirectUrl, roleRequired } = route.data;

    // Success: no auth restriction
    if (authRequired === undefined) { return true; } 

    // Success: must NOT be logged and NOT
    else if (authRequired === false && !this.authService.user) { return true; }

    // Denied: must be logged but NOT
    else if (authRequired === true && !this.authService.user) { this.url = redirectUrl ? redirectUrl : 'login'; }

    // Denied: must NOT be logged but it is
    else if (authRequired === false && this.authService.user) { this.url = redirectUrl ? redirectUrl : ''; }

    // Success: no role restriction
    else if (roleRequired === undefined) { return true; }  

    // Denied: has role but NOT required one
    else if (!this.authService.isAuthorized(roleRequired)) { this.url = redirectUrl ? redirectUrl : ''; }
    
    // Success
    else { return true; }

    this.router.navigate([this.url]);
    return false;
  }
}
