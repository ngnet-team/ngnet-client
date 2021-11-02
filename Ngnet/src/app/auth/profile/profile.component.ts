import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { IUserRequestModel } from 'src/app/interfaces/auth/user-request-model';
import { IUserResponseModel } from 'src/app/interfaces/auth/user-response-model';
import { IErrorModel } from 'src/app/interfaces/response-error-model';
import { AuthService } from 'src/app/services/auth.service';
import { LangService } from 'src/app/services/lang.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  serverErrors: IErrorModel = {};
  user: IUserResponseModel = {};
  //language
  langEvent: Subscription[] = [];
  errors: string[] | undefined;
  selectedLang: string = this.langService.langState;
  menu: any = this.langService.get(this.selectedLang).profile;
  validations: any = this.langService.get(this.selectedLang).validations;

  constructor(private authService: AuthService, private langService: LangService, private messageService: MessageService) {
    this.getProfile();
    this.langListener();
  }

  getProfile(): void {
    this.authService.profile().subscribe(res => {
      this.user = res;
      console.log(res);
    });
  }

  private langListener(): void {
    this.langEvent.push(this.langService.langEvent.subscribe(result => {
      this.menu = result.profile;
    }))
  }

  update(input: IUserRequestModel): void {
    console.log(input);
    this.authService.update(input).subscribe({
      next: (res) => {
        console.log(res);
        const msg = this.messageService.getMsg(res, this.selectedLang);
        this.messageService.event.emit(msg);
      },
      error: (err) => {
        if (err?.error) {
          this.serverErrors = err?.error;
          this.setServerError();
        };
      }
    });
  }

  private setServerError() {
    this.errors = this.selectedLang === 'bg' ? this.serverErrors?.bg : this.serverErrors?.en;
  }
}
