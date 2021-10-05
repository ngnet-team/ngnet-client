import { Component, DoCheck, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { LangService } from 'src/app/services/lang.service';
import { MessageService } from 'src/app/services/message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements DoCheck {

  message: string = '';
  
  @Input() isLogged: boolean = this.authService.isLogged;
  @Output() managerDropdown: { field: string, type: string } = { field: 'manager', type: 'route' };
  @Output() languageDropdown: { field: string, type: string, value: string } = { field: 'language', type: 'state', value: '' };

  event: Subscription[] = [];
  selectedLang: string = this.langService.getLocalStorage() ?? environment.lang.default;
  menu: any = this.langService.get(this.selectedLang).navMenu;

  constructor(private authService: AuthService, private langService: LangService, private messageService: MessageService) {
    this.subscriptionListener();
  }

  ngDoCheck(): void {
    if (this.languageDropdown.value !== this.selectedLang) {
      this.changeLang(this.languageDropdown.value);
    }
  }

  logout(): void { 
    this.isLogged = false;
    this.authService.logout();
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
    }));
  }

  changeLang(language: string): void {
    // this.selectedLang = this.selectedLang === environment.lang.bg ? environment.lang.en : environment.lang.bg;
    this.selectedLang = language;
    this.langService.setLocalStorage(this.selectedLang);
    this.menu = this.langService.get(this.selectedLang).navMenu;
  }
}
