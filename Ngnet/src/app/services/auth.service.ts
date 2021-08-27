import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ILoginModel } from '../interfaces/login-model';
import { IRegisterModel } from '../interfaces/register-model';
import { IUserResponseModel } from '../interfaces/user-response-model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl: string = environment.serverUrl + 'auth';
  get isLogged() { return this.getToken() };

  constructor(private http: HttpClient) { }

  login(input: ILoginModel): Observable<any> {
    return this.http.post(this.authUrl + '/login', input)
  }

  register(input: IRegisterModel): Observable<any> {
    return this.http.post(this.authUrl + '/register', input)
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
}
