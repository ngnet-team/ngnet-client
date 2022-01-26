import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ILoginModel } from '../../../interfaces/auth/login-model';
import { IRegisterModel } from '../../../interfaces/auth/register-model';
import { Router } from '@angular/router';
import { IUserRequestModel } from '../../../interfaces/auth/user-request-model';
import { IChangeModel } from '../../../interfaces/change-model';
import { IAdminUserModel } from '../../../interfaces/modules/dashboard/admin-user-model';
import { IParsedToken } from '../../../interfaces/auth/parsed-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authKey = 'auth?30549/token%';

  roleUrl: any = this.getParsedJwt();
  isLogged: boolean = this.roleUrl && this.roleUrl != 'auth' ? true : false ;

  protected authUrl: string = environment.authUrl;
  user : IParsedToken | undefined;

  logginEvent: EventEmitter<boolean> = new EventEmitter();

  constructor(protected http: HttpClient, protected router: Router) {
  }

  register(request: IRegisterModel): Observable<any> {
    return this.http.post(this.authUrl + this.roleUrl + '/register', request)
  }

  login(request: ILoginModel): Observable<any> {
    return this.http.post(this.authUrl + this.roleUrl + '/login', request)
  }

  logout(): void {
    this.http.get(this.authUrl + this.roleUrl + '/logout').subscribe(res => {
      localStorage.removeItem(this.authKey);
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

  resetPassword(user: IAdminUserModel): Observable<any> {
    return this.http.post(this.authUrl + this.roleUrl + '/resetPassword', user);
  }

  setToken(authToken: string): void {
    localStorage.setItem(this.authKey, authToken)
  }

  getToken(): string | null {
    return localStorage.getItem(this.authKey)
  }

  updateRoleUrl(): void {
    this.roleUrl = this.getParsedJwt();
  }

  // ============= Private =============

  private getParsedJwt(): any {
    if (this.user) { return this.user.role; }

    const token: any = this.getToken();
    if (token == null) {
      return "auth";
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
      return "auth";
    }
  }
}
