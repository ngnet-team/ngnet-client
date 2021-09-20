import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {

  @Input() isLogged: boolean = this.authService.isLogged;
  loggingEvent: Subscription[] = [];

  constructor(private authService: AuthService) {
    this.loggingEvent.push(this.authService.logginEvent.subscribe(isLogged => {
      this.isLogged = isLogged;
    }))
  }

  logout() { 
    this.isLogged = false;
    this.authService.logout();
  };
}
