import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ILoginModel } from '../interfaces/login-model';
import { IRegisterModel } from '../interfaces/register-model';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl: string = environment.serverUrl + 'auth';
  get isLogged(): boolean { return this.getToken() ? true : false };

  constructor(private http: HttpClient, private route: Router) { }

  register(input: IRegisterModel): Observable<any> {
    return this.http.post(this.authUrl + '/register', input)
  }

  login(input: ILoginModel): Observable<any> {
    return this.http.post(this.authUrl + '/login', input)
  }

  logout(): void {
    localStorage.removeItem('auth-token');
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
}
