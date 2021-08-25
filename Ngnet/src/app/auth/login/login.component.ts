import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ILoginModel } from '../../interfaces/login-model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {

  constructor(private authService: AuthService, route: Router) { }

  login(input: ILoginModel): void {

    this.authService.login(input).subscribe(res => {
      if (res) {
        console.log(res);
      }
    });
  }

}
