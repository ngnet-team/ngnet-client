import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { LangService } from 'src/app/services/lang.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {

  @Input() isLogged: boolean = this.authService.isLogged;
  loggingEvent: Subscription[] = [];
  selectedLang: string = environment.lang.default;
  menu: any = this.langService.get(this.selectedLang).navMenu;


  constructor(private authService: AuthService, private langService: LangService) {
    this.subscriptionListener();
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

  changeLang(): void {
    this.selectedLang = this.selectedLang === environment.lang.bg ? environment.lang.en : environment.lang.bg;
    this.menu = this.langService.get(this.selectedLang).navMenu;
  }
}
