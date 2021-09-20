import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IErrorModel } from 'src/app/interfaces/response-error-model';
import { ILoginModel } from '../../interfaces/login-model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {

  serverErrors: IErrorModel[] = [];

  constructor(private authService: AuthService, private route: Router) { }

  login(input: ILoginModel): void {
    this.serverErrors = [] as IErrorModel[];

    this.authService.login(input).subscribe({
      next: (res) => {
        if (res.token) {
          this.authService.setToken(res.token);
        }
        this.authService.logginEvent.emit(true);
        this.route.navigateByUrl('profile');
      },
      error: (err) => {
        (err?.error as []).forEach(e => {
          this.serverErrors.push(e);
        });
      }
    });
  }
}
