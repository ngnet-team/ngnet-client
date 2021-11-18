import { Component, DoCheck, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IAdminUserResponseModel } from '../interfaces/admin/admin-user-response-model';
import { IPageModel } from '../interfaces/page-model';
import { IPopupModel } from '../interfaces/popup-model';
import { ISideBarModel } from '../interfaces/side-bar-model';
import { AdminService } from '../services/admin.service';
import { AuthService } from '../services/auth.service';
import { IconService } from '../services/icon.service';
import { LangService } from '../services/lang.service';
import { PagerService } from '../services/pager.service';
import { PagerBase } from '../shared/base-classes/pager-base';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent extends PagerBase implements DoCheck {

  //models
  users: IAdminUserResponseModel[] = [];
  pagedUsers: IAdminUserResponseModel[] = [];

  @Output() pager: IPageModel = this.pagerService.model;
  @Output() sideMenu: ISideBarModel = { visible: false };
  @Output() infoPopup: IPopupModel = { visible: false, confirmed: false, type: 'info', getData: { from: 'care', content: [] } };

  icons: any = this.iconService.get('admin');

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private route: Router,
    router: ActivatedRoute,
    langService: LangService,
    pagerService: PagerService,
    private iconService: IconService
  ) {
    super(pagerService, langService);
    if (!this.authService.accessWithRole(router)) {
      this.route.navigateByUrl('not-found');
    };
    this.getAllUsers();
  }

  ngDoCheck(): void {
    //empty popup content when closed
    if (!this.infoPopup.visible && this.infoPopup.getData.content.length !== 0) {
      this.infoPopup.getData.content = [];
    }
  }

  getAllUsers() {
    this.adminService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res;
         //results view
         this.pagedUsers = this.pagination(this.users);
         //no items in the page
         if (this.pagedUsers.length === 0 && this.pagerService.model.totalPages > 1) {
           //TODO re-render results when the last item is deleted in current page to show previus one if avaliable 
         }
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

  deleteUser(user: IAdminUserResponseModel) {
    // this.adminService.delete(user).subscribe(res => {
    //   console.log(res);
    //   this.getAllUsers();
    // });
  }

  openMorePopup(user: IAdminUserResponseModel): void {
    this.infoPopup.getData.content.push(user.firstName
      ? user.firstName + ' ' + user.lastName
      : 'There is no more information',
    );

    this.infoPopup.visible = true;
  }

  openModifiedPopup(user: IAdminUserResponseModel): void {
    this.infoPopup.getData.content.push(user.isDeleted
      ? 'The user has been deleted on ' + user.deletedOn
      : user.modifiedOn
        ? 'The user is modified on ' + user.modifiedOn
        : 'The User is created on ' + user.createdOn
    );

    this.infoPopup.visible = true;
  }

  openExpiriancePopup(user: IAdminUserResponseModel) {
    this.infoPopup.getData.content.push('Entries: ' + user.experiances?.length ?? 0);
    let enter = true;
    user.experiances?.forEach(e => {
      if (e.loggedIn && enter) {
        enter = false;
        this.infoPopup.getData.content.push('----------------------------------------------------');
      } else if (e.loggedOut && !enter) {
        enter = true;
        this.infoPopup.getData.content.push('----------------------------------------------------');
      }

      this.infoPopup.getData.content.push(e.loggedIn ? 'Login: ' + e.loggedIn : 'LogOut: ' + e.loggedOut);
    });

    this.infoPopup.visible = true;
  }
  
  override pagerListener(): void {
    this.subscription.push(this.pagerService.pageSelect.subscribe(pageNumber => {
      this.pager.pageNumber = pageNumber;
      this.pagedUsers = this.pagination(this.users);
    }));
  }
}
