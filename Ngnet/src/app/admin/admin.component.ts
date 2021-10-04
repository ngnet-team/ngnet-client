import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

  constructor(private authService: AuthService, private route: Router, router: ActivatedRoute) {
    if(!this.authService.accessWithRole(router)){
      this.route.navigateByUrl('');
    };
   }
}
