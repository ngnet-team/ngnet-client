import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IUserResponseModel } from 'src/app/interfaces/user-response-model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent {

  user: IUserResponseModel = {};

  constructor(private authService: AuthService, private route: Router) {
    this.getProfile();
  }

  getProfile(): void {
    this.authService.profile().subscribe(res => {
      this.user = res;
      console.log(this.user);
    });
  }
}
