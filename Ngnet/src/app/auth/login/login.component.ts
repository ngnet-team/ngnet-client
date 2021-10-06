import { Component, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IErrorModel } from 'src/app/interfaces/response-error-model';
import { LangService } from 'src/app/services/lang.service';
import { MessageService } from 'src/app/services/message.service';
import { ILoginModel } from '../../interfaces/auth/login-model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  langEvent: Subscription[] = [];
  serverErrors: IErrorModel = {};
  //language
  selectedLang: string = this.langService.langState;
  errors: string[] | undefined;
  menu: any = this.langService.get(this.selectedLang).login;
  validations: any = this.langService.get(this.selectedLang).validations;

  constructor(private authService: AuthService, private route: Router, private langService: LangService, private messageService: MessageService) {
    this.langListener();
   }

  login(input: ILoginModel): void {
    this.serverErrors = {} as IErrorModel;

    this.authService.login(input).subscribe({
      next: (res) => {
        if (res.token) {
          this.authService.setToken(res.token);
        }
        const msg = this.messageService.getMsg(res.responseMessage, this.selectedLang);
        this.messageService.event.emit(msg);
        this.authService.logginEvent.emit(true);
        this.route.navigateByUrl('profile');
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

  private langListener(): void {
    this.langEvent.push(this.langService.langEvent.subscribe(result => {
      this.selectedLang = this.langService.langState;
      this.menu = result.login;
      this.validations = result.validations;
      this.setServerError();
    }))
  }
}
