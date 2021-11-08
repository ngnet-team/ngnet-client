import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IErrorModel } from 'src/app/interfaces/response-error-model';
import { LangService } from 'src/app/services/lang.service';
import { MessageService } from 'src/app/services/message.service';
import { ServerErrorsBase } from 'src/app/shared/base-classes/server-errors-base';
import { ILoginModel } from '../../interfaces/auth/login-model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends ServerErrorsBase {

  //language
  menu: any = this.langService.get(this.selectedLang).login;
  validations: any = this.langService.get(this.selectedLang).validations;

  constructor(private authService: AuthService, private route: Router, langService: LangService, private messageService: MessageService) {
    super(langService);
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
        this.redirect('profile');
      },
      error: (err) => {
        if (err?.error) {
          this.serverErrors = err?.error;
          this.setServerError();
        };
      }
    });
  }

  override langListener(): void {
    this.subscription.push(this.langService.langEvent.subscribe(result => {
      this.menu = result.login;
      this.validations = result.validations;
      this.setServerError();
    }))
  }

  
  redirect(path: string): void {
    this.route.navigateByUrl(path);
  }
}
