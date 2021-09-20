import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IUserResponseModel } from 'src/app/interfaces/user-response-model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent {

  user: IUserResponseModel = {};

  constructor(private authService: AuthService, private route: Router, private router: ActivatedRoute) {
    this.getProfile();
  }

  getProfile(): void {
    this.authService.profile().subscribe(res => {
      this.user = res;
    });
  }
}
