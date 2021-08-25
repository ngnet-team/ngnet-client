import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IRegisterModel } from '../../interfaces/register-model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent {

  constructor(private authService: AuthService, route: Router) { }

  register(input: IRegisterModel): void {

    this.authService.register(input).subscribe(res => {
      if (res) {
        console.log(res);
      }
    });
  }
}
