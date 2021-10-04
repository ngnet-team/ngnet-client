import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { IUserRequestModel } from 'src/app/interfaces/auth/user-request-model';
import { IUserResponseModel } from 'src/app/interfaces/auth/user-response-model';
import { IErrorModel } from 'src/app/interfaces/response-error-model';
import { AuthService } from 'src/app/services/auth.service';
import { LangService } from 'src/app/services/lang.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  serverErrors: IErrorModel[] = [];
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

  update(input: IUserRequestModel): void {
    this.authService.update(input).subscribe({
      next: (res) => {
        //success
      },
      error: (err) => {
        (err?.error as []).forEach(e => {
          this.serverErrors.push(e);
        });
      }
    });
  }
}
