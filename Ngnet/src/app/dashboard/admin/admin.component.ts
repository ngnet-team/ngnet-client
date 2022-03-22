import { Component, DoCheck, Output } from '@angular/core';
import { IAdminUserModel } from '../../interfaces/modules/dashboard/admin-user-model';
import { IChangeModel } from '../../interfaces/change-model';
import { IDropDownOutputModel } from '../../interfaces/dropdown/dropdown-output';
import { IPageModel } from '../../interfaces/page-model';
import { IPopupModel } from '../../interfaces/popup-model';
import { ISideBarModel } from '../../interfaces/side-bar-model';
import { AuthService } from '../../services/auth/auth.service';
import { IconService } from '../../services/common/icon/icon.service';
import { LangService } from '../../services/common/lang/lang.service';
import { MessageService } from '../../services/common/message/message.service';
import { PagerService } from '../../services/components/pager/pager.service';
import { PagerBase } from '../../shared/base-classes/pager-base';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { IEntryModel } from 'src/app/interfaces/modules/dashboard/entry-model';
import { IDashboardModel } from 'src/app/interfaces/shared/dashboard-model';
import { IDashboardContentModel } from 'src/app/interfaces/shared/dashboard-content-model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent extends PagerBase implements DoCheck {

  //models
  users: IDashboardContentModel[] | undefined;
  entries: IDashboardContentModel[] | undefined;
  filteredUsers: IAdminUserModel[] = [];
  pagedUsers: IAdminUserModel[] = [];
  updatingUser: IAdminUserModel = {};

  @Output() pager: IPageModel = this.pagerService.getInstance();
  @Output() sideMenu: ISideBarModel = { visible: false };
  @Output() infoPopup: IPopupModel = { visible: false, confirmed: false, type: 'info', getData: { from: 'admin', content: [] } };
  @Output() confirmPopup: IPopupModel = { visible: false, confirmed: false, type: 'confirm', getData: { from: 'admin' } };
  @Output() changePopup: IPopupModel = { visible: false, confirmed: false, type: 'change', getData: { from: 'admin' } };
  @Output() filterDropdown: IDropDownOutputModel = { field: 'filterAdmin', type: 'state', value: '' };
  @Output() usersDashboard: IDashboardModel = {
    header: [
      {
        name: 'Id',
        sort: false,
      },
      {
        name: 'Role',
        sort: true,
      },
      {
        name: 'Username',
        sort: true,
      },
      {
        name: 'Email',
        sort: true,
      },
    ],
    filters: this.filterDropdown,
  };
  @Output() entriesDashboard: IDashboardModel = {
    header: [
      {
        name: 'User Id',
        sort: false,
      },
      {
        name: 'Username',
        sort: true,
      },
      {
        name: 'Action',
        sort: true,
      },
      {
        name: 'CreatedOn',
        sort: true,
      },
    ],
  };

  icons: any = this.iconService.get(this.component.admin);
  //temporary
  filteredBy: string = 'all';
  infos: string[] | undefined;

  constructor(
    langService: LangService,
    iconService: IconService,
    authService: AuthService,
    router: Router,
    pagerService: PagerService,
    private dashboardService: DashboardService,
    private messageService: MessageService,
  ) {
    super(langService, iconService, authService, router, pagerService);
    this.config(this.component.admin);
    this.getUsers();
    this.getEntries();
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

    //Dashboard
    if (this.users) {
      this.usersDashboard.content = this.users;
    }

    if (this.entries) {
      this.entriesDashboard.content = this.entries;
    }
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

  // ------- Private -------

  private getUsers(): void {
    this.dashboardService.getUsers().subscribe({
      next: (res) => {
        this.users = (res as IAdminUserModel[]).reduce((acc, curr) => {
          const user: IDashboardContentModel = {
            row: [
              {
                name: curr.id,
              },
              {
                name: curr.roleName,
                editable: true,
              },
              {
                name: curr.userName,
                editable: true,
              },
              {
                name: curr.email,
                editable: true,
              },
            ]
          };
          acc.push(user);
          return acc;
        }, [] as IDashboardContentModel[]);
      },
      error: (err) => {
        if (err?.error) {
          this.serverErrors = err?.error;
          this.setServerError();
        };
      }
    });
  }

  private getEntries(): void {
    this.dashboardService.getEntries().subscribe({
      next: (res) => {
        this.entries = (res as IEntryModel[]).reduce((acc, curr) => {
          const user: IDashboardContentModel = {
            row: [
              {
                name: curr.userId,
              },
              {
                name: curr.username,
              },
              {
                name: curr.login == true ? 'Sign In' : 'Sign Out',
              },
              {
                name: (curr.createdOn as Date).toString(),
              },
            ]
          };
          acc.push(user);
          return acc;
        }, [] as IDashboardContentModel[]);
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
    this.authService.change(input).subscribe({
      next: (res) => {
        const msg = this.messageService.getMsg(res, this.selectedLang);
        this.messageService.event.emit(msg);
        this.getUsers();
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

    this.dashboardService.changeRole(user).subscribe({
      next: (res) => {
        const msg = this.messageService.getMsg(res, this.selectedLang);
        this.messageService.event.emit(msg);
        this.getUsers();
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
    this.authService.update(this.updatingUser).subscribe({
      next: (res) => {
        const msg = this.messageService.getMsg(res, this.selectedLang);
        this.messageService.event.emit(msg);
        this.getUsers();
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
    this.authService.resetPassword(this.updatingUser).subscribe({
      next: (res) => {
        const msg = this.messageService.getMsg(res?.msg, this.selectedLang);
        this.infos = [];
        this.infos.push(` Your new password is: ${res?.newPassword}.`);
        this.messageService.event.emit(msg);
        this.getUsers();
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
    // switch (this.filteredBy) {
    //   case 'all':
    //     this.filteredUsers = this.users;
    //     break;
    //   case 'modified':
    //     this.filteredUsers = this.users.filter(u => u.modifiedOn);
    //     break;
    //   case 'deleted':
    //     this.filteredUsers = this.users.filter(u => u.isDeleted);
    //     break;
    //   default:
    //     this.filteredUsers = this.users;
    //     break;
    // }

    this.pagedUsers = this.pagination(this.pager, this.filteredUsers);
    //no items in the page
    if (this.pagedUsers.length === 0 && this.pager.totalPages > 1) {
      //TODO 
      console.log('re-render results when the last item is deleted in current page to show previus one if avaliable');
    }
  }

  override pagerListener(): void {
    this.subscription.push(this.pagerService.pageSelect.subscribe(pageNumber => {
      this.pager.pageNumber = pageNumber;
      this.pagedUsers = this.pagination(this.pager, this.filteredUsers);
    }));
  }
}