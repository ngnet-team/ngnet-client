import { Component, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IUserResponseModel } from '../interfaces/auth/user-response-model';
import { ISideBarModel } from '../interfaces/side-bar-model';
import { AdminService } from '../services/admin.service';
import { AuthService } from '../services/auth.service';
import { LangService } from '../services/lang.service';
import { ServerErrorsBase } from '../shared/base-classes/server-errors-base';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent extends ServerErrorsBase {

  users: IUserResponseModel[] = [];

  @Output() sideMenu: ISideBarModel = { visible: false };

  constructor(private adminService: AdminService, private authService: AuthService, private route: Router, router: ActivatedRoute, langService: LangService) {
    super(langService);
    if(!this.authService.accessWithRole(router)){
      this.route.navigateByUrl('not-found');
    };
    this.getAllUsers();
   }

   getAllUsers() {
    this.adminService.getAllUsers().subscribe({
      next: (res) => {
        console.log(res);
        this.users = res;
      },
      error: (err) => {
        console.log(err);
        if (err?.error) {
          this.serverErrors = err?.error;
          this.setServerError();
        };
      }
    });
   }
}
