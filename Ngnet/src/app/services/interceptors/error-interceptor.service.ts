import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IErrorModel } from 'src/app/interfaces/response-error-model';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService implements HttpInterceptor {

  constructor(private route: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<IErrorModel>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error);
          if (error.status === 0) {
            this.route.navigateByUrl("server-not-found");
          }
          return throwError(error);
        })
      )
  }
}
