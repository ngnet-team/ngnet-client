import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IErrorModel } from 'src/app/interfaces/response-error-model';
import { IRegisterModel } from '../../interfaces/register-model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent {

  serverErrors: IErrorModel[] = [];

  constructor(private authService: AuthService, private route: Router) { }

  register(input: IRegisterModel): void {
    this.serverErrors = [] as IErrorModel[];

    this.authService.register(input).subscribe({
      next: () => {
        this.route.navigateByUrl('login');
      }, 
      error: (err) => {
        (err?.error as []).forEach(e => {
          this.serverErrors.push(e);
        });
      }
    });
  }
}
