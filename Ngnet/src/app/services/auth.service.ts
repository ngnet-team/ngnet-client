import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ILoginModel } from '../interfaces/auth/login-model';
import { IRegisterModel } from '../interfaces/auth/register-model';
import { ActivatedRoute, Router } from '@angular/router';
import { IUserRequestModel } from '../interfaces/auth/user-request-model';
import { IChangeModel } from '../interfaces/change-model';
import { IAdminUserResponseModel } from '../interfaces/admin/admin-user-response-model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl: string = environment.serverUrl + 'auth';
  get isLogged(): boolean { return this.getToken() ? true : false };
  logginEvent: EventEmitter<boolean> = new EventEmitter();

  constructor(private http: HttpClient, private route: Router) { }

  register(request: IRegisterModel): Observable<any> {
    return this.http.post(this.authUrl + '/register', request)
  }

  login(request: ILoginModel): Observable<any> {
    return this.http.post(this.authUrl + '/login', request)
  }

  logout(): void {
    this.http.get(this.authUrl + '/logout').subscribe(res => {
      localStorage.removeItem('auth-token');
    });
    this.route.navigateByUrl('');
  }

  profile(): Observable<any> {
    return this.http.get(this.authUrl + '/profile');
  }

  setToken(authToken: string): void {
    localStorage.setItem('auth-token', authToken)
  }

  getToken(): string | null {
    return localStorage.getItem('auth-token')
  }

  accessWithRole(router: ActivatedRoute): boolean {
    var currRole: string = router.snapshot.data?.profile?.roleName;
    var requiredRole: string = router.snapshot.data?.requiredRole

    if (requiredRole === undefined) {
      return true;
    }

    return requiredRole === currRole;
  }

  update(request: IUserRequestModel): Observable<any> {
    return this.http.post(this.authUrl + '/update', request);
  }

  change(request: IChangeModel): Observable<any> {
    return this.http.post(this.authUrl + '/change', request);
  }
}
