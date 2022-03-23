import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ILoginModel } from '../../interfaces/auth/login-model';
import { IRegisterModel } from '../../interfaces/auth/register-model';
import { Router } from '@angular/router';
import { IUserRequestModel } from '../../interfaces/auth/user-request-model';
import { IChangeModel } from '../../interfaces/change-model';
import { IAdminUserModel } from '../../interfaces/modules/dashboard/admin-user-model';
import { IParsedToken } from '../../interfaces/auth/parsed-token';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authKey = 'NgNet.authorization.token';
  private roles = [ 'owner', 'admin', 'member', 'user' ];

  roleUrl: any = this.getParsedJwt();
  isLogged: boolean = this.roleUrl;

  protected authUrl: string = environment.servers.auth;
  user : IParsedToken | undefined;

  logginEvent: EventEmitter<boolean> = new EventEmitter();

  constructor(protected http: HttpClient, protected router: Router, protected cookieService: CookieService) {
  }

  register(request: IRegisterModel): Observable<any> {
    return this.http.post(this.authUrl + 'register', request)
  }

  login(request: ILoginModel): Observable<any> {
    return this.http.post(this.authUrl + 'login', request)
  }

  resetPassword(user: IAdminUserModel): Observable<any> {
    return this.http.post(this.authUrl + 'resetPassword', user);
  }

  logout(): void {
    this.http.get(this.authUrl + this.roleUrl + '/logout').subscribe(res => {
      this.cookieService.delete(this.authKey);
      this.user = undefined;
      this.updateRoleUrl();
    });
    this.router.navigateByUrl('');
  }

  profile(): Observable<any> {
    return this.http.get(this.authUrl + this.roleUrl + '/profile');
  }

  update(request: IUserRequestModel): Observable<any> {
    return this.http.post(this.authUrl + this.roleUrl + '/update', request);
  }

  change(request: IChangeModel): Observable<any> {
    return this.http.post(this.authUrl + this.roleUrl + '/change', request);
  }

  setToken(authToken: string): void {
    this.cookieService.set(this.authKey, authToken);
  }

  getToken(): string {
    return this.cookieService.get(this.authKey);
  }

  updateRoleUrl(): void {
    this.roleUrl = this.getParsedJwt();
  }

  isAuthorized(role: string) {
    if (!role || !this.user) { return false; }

    const requiredRole = this.roles.indexOf(role);
    if (requiredRole === -1) { return false; }

    const userRole = this.roles.indexOf((this.user as IParsedToken).role as string);
    if (userRole === -1) { return false; }

    return userRole <= requiredRole;
  }

  // ============= Private =============

  private getParsedJwt(): string | undefined {
    if (this.user) { return this.user.role; }

    const token: any = this.getToken();
    if (token == null) {
      return '';
    }

    try {
      const parsedToken = JSON.parse(atob(token.split('.')[1]));
      this.user = { 
        userId: parsedToken.nameid, 
        username: parsedToken.unique_name, 
        role: parsedToken.role.toLowerCase(), 
      }

      return this.user.role;
    } catch (error) {
      return '';
    }
  }
}
