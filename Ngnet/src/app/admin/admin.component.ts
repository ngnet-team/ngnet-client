import { Component, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IAdminUserResponseModel } from '../interfaces/admin/admin-user-response-model';
import { IPopupModel } from '../interfaces/popup-model';
import { ISideBarModel } from '../interfaces/side-bar-model';
import { AdminService } from '../services/admin.service';
import { AuthService } from '../services/auth.service';
import { IconService } from '../services/icon.service';
import { LangService } from '../services/lang.service';
import { ServerErrorsBase } from '../shared/base-classes/server-errors-base';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent extends ServerErrorsBase {

  users: IAdminUserResponseModel[] = [];

  @Output() sideMenu: ISideBarModel = { visible: false };
  @Output() infoPopup: IPopupModel = { visible: false, confirmed: false, type: 'info', getData: { from: 'care' } };

  icons: any = this.iconService.get('admin');

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private route: Router,
    router: ActivatedRoute,
    langService: LangService,
    private iconService: IconService
  ) {
    super(langService);
    if (!this.authService.accessWithRole(router)) {
      this.route.navigateByUrl('not-found');
    };
    this.getAllUsers();
  }

  getAllUsers() {
    this.adminService.getAllUsers().subscribe({
      next: (res) => {
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

  openMorePopup(user: IAdminUserResponseModel): void {
    this.infoPopup.getData = {
      content: user.firstName
        ? user.firstName + ' ' + user.lastName
        : 'There is no more information',
    };

    this.infoPopup.visible = true;
  }

  openModifiedPopup(user: IAdminUserResponseModel): void {
    this.infoPopup.getData = {
      content: user.isDeleted
        ? 'The user has been deleted on ' + user.deletedOn
        : user.modifiedOn
          ? 'The user is modified on ' + user.modifiedOn
          : 'The User is created on ' + user.createdOn
    };

    this.infoPopup.visible = true;
  }

  openExpiriancePopup(user: IAdminUserResponseModel) {

    this.infoPopup.getData.content = [];
    this.infoPopup.getData.content.push('Entries: ' + user.experiances?.length ?? 0);

    user.experiances?.forEach(e => {
      this.infoPopup.getData.content.push(e.loggedIn ? 'Login: ' + e.loggedIn : 'LogOut: ' + e.loggedOut);
    });

    this.infoPopup.visible = true;
  }
}
