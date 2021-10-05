import { Component, DoCheck, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { LangService } from 'src/app/services/lang.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements DoCheck {

  @Input() isLogged: boolean = this.authService.isLogged;

  @Output() managerDropdown: { field: string, type: string } = { field: 'manager', type: 'route' };
  @Output() languageDropdown: { field: string, type: string, value: string } = { field: 'language', type: 'state', value: '' };

  loggingEvent: Subscription[] = [];
  selectedLang: string = this.langService.getLocalStorage() ?? environment.lang.default;
  menu: any = this.langService.get(this.selectedLang).navMenu;

  constructor(private authService: AuthService, private langService: LangService) {
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

  private subscriptionListener(): void {
    this.loggingEvent.push(this.authService.logginEvent.subscribe(isLogged => {
      this.isLogged = isLogged;
    }))
  }

  changeLang(language: string): void {
    // this.selectedLang = this.selectedLang === environment.lang.bg ? environment.lang.en : environment.lang.bg;
    this.selectedLang = language;
    this.langService.setLocalStorage(this.selectedLang);
    this.menu = this.langService.get(this.selectedLang).navMenu;
  }
}
