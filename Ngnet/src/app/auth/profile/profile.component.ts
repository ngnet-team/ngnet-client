import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { IUserResponseModel } from 'src/app/interfaces/user-response-model';
import { AuthService } from 'src/app/services/auth.service';
import { LangService } from 'src/app/services/lang.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent {

  user: IUserResponseModel = {};
  langEvent: Subscription[] = [];
  selectedLang: string = this.langService.langState;
  menu: any = this.langService.get(this.selectedLang).profile;

  constructor(private authService: AuthService, private langService: LangService) {
    this.getProfile();
    this.langListener();
  }

  getProfile(): void {
    this.authService.profile().subscribe(res => {
      this.user = res;
    });
  }

  private langListener(): void {
    this.langEvent.push(this.langService.langEvent.subscribe(result => {
      this.menu = result.profile;
    }))
  }
}
