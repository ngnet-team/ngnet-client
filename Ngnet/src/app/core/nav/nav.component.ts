import { Component, DoCheck, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/modules/auth/auth.service';
import { LangService } from 'src/app/services/common/lang/lang.service';
import { MessageService } from 'src/app/services/common/message/message.service';
import { environment } from 'src/environments/environment';
import { TabService } from 'src/app/services/common/tab/tab.service';
import { ITabModel } from 'src/app/interfaces/tab-model';
import { IPopupModel } from 'src/app/interfaces/popup-model';
import { IconService } from 'src/app/services/common/icon/icon.service';
import { IDropDownOutputModel } from 'src/app/interfaces/dropdown/dropdown-output';
import { Router } from '@angular/router';
import { Base } from 'src/app/shared/base-classes/base';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent extends Base implements DoCheck {

  @Input() tab: ITabModel = {};
  @Input() isLogged: boolean = this.authService.isLogged;

  @Output() adminDropdown: IDropDownOutputModel = { field: 'admin', type: 'route' };
  @Output() managerDropdown: IDropDownOutputModel = { field: 'manager', type: 'route' };
  @Output() languageDropdown: IDropDownOutputModel = { field: 'language', type: 'state', value: '' };
  @Output() confirmPopup: IPopupModel = { visible: false, confirmed: false, type: 'confirm', getData: { from: 'nav', switcher: false } };
  @Output() tabMenu: boolean = false;
  //language
  event: Subscription[] = [];
  selectedLang: string = this.langService.getLocalStorage() ?? environment.lang.default;
  menu: any = this.langService.get(this.selectedLang).nav;
  icons: any = this.iconService.get('nav');
  //temporary
  message: string = '';
  isAdmin: boolean = this.hasPermissions('admin');
  isOwner: boolean = this.hasPermissions('owner');
  notification: boolean = false;
  notificationCount: number = 0;

  constructor(
    langService: LangService,
    iconService: IconService,
    authService: AuthService,
    router: Router, 
    private messageService: MessageService, 
    private tabService: TabService,
    ) {
      super(langService, iconService, authService, router);
    this.subscriptionListener();
  }

  ngDoCheck(): void {
    //change language only the value is different and existing one
    if (this.languageDropdown.value !== this.selectedLang && this.languageDropdown.value) {
      this.changeLang(this.languageDropdown.value);
    }

    if (this.confirmPopup.confirmed) {
      this.messageService.remindClicked.emit(true);
      this.isLogged = false;
      this.authService.logout();
      this.confirmPopup.confirmed = false;
    }

    if (this.tab.url !== undefined) {
      
      if (this.tab.url === 'logout') {
        this.openConfirmPopup();
      }
    }
  }

  public redirect(path: string = 'not-found'): void {
    this.router.navigateByUrl(path);
  }

  openConfirmPopup(): void {
    this.confirmPopup.visible = true;
  };

  removeMessage() {
    this.message = '';
  }

  changeLang(language: string): void {
    this.selectedLang = language;
    this.langService.setLocalStorage(this.selectedLang);
    this.menu = this.langService.get(this.selectedLang).nav;
  }

  notificationToggle(): void {
    this.notification = !this.notification;
    this.messageService.notificationVisibility.emit(this.notification);
  }

  openTabMenu(): void {
    this.tabMenu = !this.tabMenu;
  }

  private subscriptionListener(): void {
    this.event.push(this.authService.logginEvent.subscribe(isLogged => {
      this.isLogged = isLogged;
    }));
    this.event.push(this.messageService.event.subscribe(message => {
      this.message = message;

      setTimeout(() => {
        this.removeMessage();
      }, 2000);
    }));
    this.event.push(this.tabService.event.subscribe(tab => {
      this.tab = tab;
    }));
    this.event.push(this.messageService.notificationCount.subscribe(count => {
      this.notificationCount = count;
    }));
  }
}
