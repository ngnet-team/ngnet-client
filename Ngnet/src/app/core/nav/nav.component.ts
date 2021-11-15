import { Component, DoCheck, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { LangService } from 'src/app/services/lang.service';
import { MessageService } from 'src/app/services/message.service';
import { environment } from 'src/environments/environment';
import { faBars, faLanguage, faPoll, faUser, faSignOutAlt, faSignInAlt, faUserPlus, faChessKing } from '@fortawesome/free-solid-svg-icons';
import { TabService } from 'src/app/services/tab.service';
import { ITabModel } from 'src/app/interfaces/tab-model';
import { IPopupModel } from 'src/app/interfaces/popup-model';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements DoCheck {

  message: string = '';
  @Input() tab: ITabModel = {};
  @Input() isLogged: boolean = this.authService.isLogged;

  @Output() adminDropdown: { field: string, type: string } = { field: 'admin', type: 'route' };
  @Output() managerDropdown: { field: string, type: string } = { field: 'manager', type: 'route' };
  @Output() languageDropdown: { field: string, type: string, value: string } = { field: 'language', type: 'state', value: '' };
  @Output() confirmPopup: IPopupModel = { visible: false, confirmed: false, type: 'confirm', getData: { from: 'nav' } };
  @Output() tabMenu: boolean = false;
  //language
  event: Subscription[] = [];
  selectedLang: string = this.langService.getLocalStorage() ?? environment.lang.default;
  menu: any = this.langService.get(this.selectedLang).navMenu;
  //icons
  adminIcon = faChessKing;
  registerIcon = faUserPlus;
  loginIcon = faSignInAlt;
  logoutIcon = faSignOutAlt;
  userIcon = faUser;
  managerIcon = faPoll;
  languageIcon = faLanguage;
  hamburgerIcon = faBars;

  constructor(private authService: AuthService, private langService: LangService, private messageService: MessageService, private tabService: TabService) {
    this.subscriptionListener();
    console.log(this.menu);
  }

  ngDoCheck(): void {
    //change language only the value is different and existing one
    if (this.languageDropdown.value !== this.selectedLang && this.languageDropdown.value) {
      this.changeLang(this.languageDropdown.value);
    }

    if (!this.confirmPopup.visible) {
      // console.log('close it');
    }

    if (this.confirmPopup.confirmed) {
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

  openConfirmPopup(): void {
    this.confirmPopup.visible = true;
  };

  removeMessage() {
    this.message = '';
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
  }

  changeLang(language: string): void {
    // this.selectedLang = this.selectedLang === environment.lang.bg ? environment.lang.en : environment.lang.bg;
    this.selectedLang = language;
    this.langService.setLocalStorage(this.selectedLang);
    this.menu = this.langService.get(this.selectedLang).navMenu;
  }

  openTabMenu(): void {
    this.tabMenu = !this.tabMenu;
  }
}
