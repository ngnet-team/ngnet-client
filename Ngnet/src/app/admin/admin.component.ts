import { Component, DoCheck, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IAdminUserModel } from '../interfaces/admin/admin-user-model';
import { IChangeModel } from '../interfaces/change-model';
import { IDropDownOutputModel } from '../interfaces/dropdown/dropdown-output';
import { IPageModel } from '../interfaces/page-model';
import { IPopupModel } from '../interfaces/popup-model';
import { ISideBarModel } from '../interfaces/side-bar-model';
import { AdminService } from '../services/admin.service';
import { AuthService } from '../services/auth.service';
import { IconService } from '../services/icon.service';
import { LangService } from '../services/lang.service';
import { MessageService } from '../services/message.service';
import { PagerService } from '../services/pager.service';
import { PagerBase } from '../shared/base-classes/pager-base';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent extends PagerBase implements DoCheck {

  //models
  users: IAdminUserModel[] = [];
  filteredUsers: IAdminUserModel[] = [];
  pagedUsers: IAdminUserModel[] = [];
  updatingUser: IAdminUserModel = {};

  @Output() pager: IPageModel = this.pagerService.model;
  @Output() sideMenu: ISideBarModel = { visible: false };
  @Output() infoPopup: IPopupModel = { visible: false, confirmed: false, type: 'info', getData: { from: 'admin', content: [] } };
  @Output() confirmPopup: IPopupModel = { visible: false, confirmed: false, type: 'confirm', getData: { from: 'admin' } };
  @Output() changePopup: IPopupModel = { visible: false, confirmed: false, type: 'change', getData: { from: 'admin' } };
  @Output() filterDropdown: IDropDownOutputModel = { field: 'filterAdmin', type: 'state', value: '' };

  icons: any = this.iconService.get(this.component.admin);
  //temporary
  filteredBy: string = 'all';
  infos: string[] | undefined;

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private route: Router,
    router: ActivatedRoute,
    langService: LangService,
    pagerService: PagerService,
    private messageService: MessageService,
    private iconService: IconService
  ) {
    super(pagerService, langService);
    if (!this.authService.accessWithRole(router)) {
      this.route.navigateByUrl('not-found');
    };
    this.getAllUsers();
    this.pagerService.setPerPage(10);
  }

  ngDoCheck(): void {
    //INFO popup: empty popup content when closed
    if (!this.infoPopup.visible && this.infoPopup.getData.content.length !== 0) {
      this.infoPopup.getData.content = [];
    }

    //CONFIRM popup
    const confirmPopup = this.confirmPopupChecker(this.confirmPopup);
    if (confirmPopup.switcher) { this.delete(); } 
    else if (confirmPopup.confirmed) { this.resetPassword(); }

    //DROPDOWN input: change filter only the value is different and existing one
    if (this.filterDropdown.value && this.filterDropdown.value !== this.filteredBy) {
      this.filteredBy = this.filterDropdown.value;
      this.filter();
    }

    //CHANGE popup
    const changePopup = this.changePopupChecker(this.changePopup);
    if (changePopup.repeat) { this.change(changePopup.model); } 
    else if (changePopup.changed) { this.changeRole(changePopup.model); }
  }

  clear() {
    this.infos = undefined;
    this.errors = undefined;
  }

  // ------- Popups -------
  openChangePopup(label: string, user: IAdminUserModel, type: string, repeat: boolean = false): void {
    this.updatingUser = user;

    this.changePopup.getData = {
      label: label.toLowerCase(),
      repeat: repeat
    };

    if (repeat && type === 'email') {
      this.changePopup.getData.value = user.email;
      this.changePopup.getData.type = type;
    } else {
      this.changePopup.getData.value = user.roleName;
    }

    this.changePopup.type = 'change';
    this.changePopup.visible = true;
    this.errors = undefined;
  }
  
  openConfirmPopup(user: IAdminUserModel, switcher: boolean = false): void {
    if (switcher) {
      this.confirmPopup.getData.switcher = true;
      this.confirmPopup.getData.label = 'Permanent';
    } else {
      this.confirmPopup.getData.switcher = false;
    }

    this.updatingUser = user;
    this.confirmPopup.visible = true;
  }

  openMorePopup(user: IAdminUserModel): void {
    this.infoPopup.getData.content.push(user.firstName
      ? user.firstName + ' ' + user.lastName
      : 'There is no more information',
    );

    this.infoPopup.visible = true;
  }

  openModifiedPopup(user: IAdminUserModel): void {
    this.infoPopup.getData.content.push(user.isDeleted
      ? 'The user has been deleted on ' + user.deletedOn
      : user.modifiedOn
        ? 'The user is modified on ' + user.modifiedOn
        : 'The User is created on ' + user.createdOn
    );

    this.infoPopup.visible = true;
  }

  openExpiriancePopup(user: IAdminUserModel): void {
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
  // ------- Private -------

  private getAllUsers(): void {
    this.adminService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.filter();
        //results view
        this.pagedUsers = this.pagination(this.filteredUsers);
        //no items in the page
        if (this.pagedUsers.length === 0 && this.pagerService.model.totalPages > 1) {
          //TODO 
          console.log('re-render results when the last item is deleted in current page to show previus one if avaliable');
        }
      },
      error: (err) => {
        if (err?.error) {
          this.serverErrors = err?.error;
          this.setServerError();
        };
      }
    });
  }

  private change(input: IChangeModel): void {
    if (!this.updatingUser) {
      return;
    }
    input.userId = this.updatingUser.id;
    this.adminService.change(input).subscribe({
      next: (res) => {
        const msg = this.messageService.getMsg(res, this.selectedLang);
        this.messageService.event.emit(msg);
        this.getAllUsers();
      },
      error: (err) => {
        if (err?.error?.errors) {
          this.unhandledServerError(err?.error.errors);
        } else if (err?.error) {
          this.serverErrors = err?.error;
          this.setServerError();
        };
      }
    });
  }

  private changeRole(input: IChangeModel): void {
    var user = {
      id: this.updatingUser.id, 
      roleName: input.new
    } as IAdminUserModel;

    this.adminService.changeRole(user).subscribe({
      next: (res) => {
        const msg = this.messageService.getMsg(res, this.selectedLang);
        this.messageService.event.emit(msg);
        this.getAllUsers();
      },
      error: (err) => {
        if (err?.error?.errors) {
          this.unhandledServerError(err?.error.errors);
        } else if (err?.error) {
          this.serverErrors = err?.error;
          this.setServerError();
        };
      }
    });
  }

  private delete(permanent: boolean = false): void {
    this.updatingUser.isDeleted = true;
    this.updatingUser.permanentDeletion = permanent;
    this.adminService.update(this.updatingUser).subscribe({
      next: (res) => {
        const msg = this.messageService.getMsg(res, this.selectedLang);
        this.messageService.event.emit(msg);
        this.getAllUsers();
      },
      error: (err) => {
        if (err?.error?.errors) {
          this.unhandledServerError(err?.error.errors);
        } else if (err?.error) {
          this.serverErrors = err?.error;
          this.setServerError();
        };
      }
    });
  }

  private resetPassword(): void {
    this.adminService.resetPassword(this.updatingUser).subscribe({
      next: (res) => {
        const msg = this.messageService.getMsg(res?.msg, this.selectedLang);
        this.infos = [];
        this.infos.push(` Your new password is: ${res?.newPassword}.`);
        this.messageService.event.emit(msg);
        this.getAllUsers();
      },
      error: (err) => {
        if (err?.error?.errors) {
          this.unhandledServerError(err?.error.errors);
        } else if (err?.error) {
          this.serverErrors = err?.error;
          this.setServerError();
        };
      }
    });
  }

  private filter(): void {
    switch (this.filteredBy) {
      case 'all':
        this.filteredUsers = this.users;
        break;
      case 'modified':
        this.filteredUsers = this.users.filter(u => u.modifiedOn);
        break;
      case 'deleted':
        this.filteredUsers = this.users.filter(u => u.isDeleted);
        break;
      default:
        this.filteredUsers = this.users;
        break;
    }

    this.pagedUsers = this.pagination(this.filteredUsers);
    //no items in the page
    if (this.pagedUsers.length === 0 && this.pagerService.model.totalPages > 1) {
      //TODO 
      console.log('re-render results when the last item is deleted in current page to show previus one if avaliable');
    }
  }

  override pagerListener(): void {
    this.subscription.push(this.pagerService.pageSelect.subscribe(pageNumber => {
      this.pager.pageNumber = pageNumber;
      this.pagedUsers = this.pagination(this.filteredUsers);
    }));
  }
}