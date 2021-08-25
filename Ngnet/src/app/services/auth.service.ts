import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ILoginModel } from '../interfaces/login-model';
import { IRegisterModel } from '../interfaces/register-model';

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

  setToken(authToken: string) {
    localStorage.setItem('auth-token', authToken)
  }

  getToken() {
    return localStorage.getItem('auth-token')
  }
}
