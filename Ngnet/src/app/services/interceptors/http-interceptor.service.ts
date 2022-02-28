import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../modules/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService  implements  HttpInterceptor {

  token: string = this.authService.getToken();

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      setHeaders: {
        Authorization: this.token ? `Bearer ${this.token}` : this.token,
        'x-api-key': 'FC14A488-0C65-4052-BA99-FAC18291B5FC',
      }
    });
    return next.handle(req);
  };
}
