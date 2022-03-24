import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IErrorModel } from 'src/app/interfaces/response-error-model';
import { IconService } from 'src/app/services/common/icon/icon.service';
import { LangService } from 'src/app/services/common/lang/lang.service';
import { MessageService } from 'src/app/services/common/message/message.service';
import { ServerErrorsBase } from 'src/app/shared/base-classes/server-errors-base';
import { ILoginModel } from '../../interfaces/auth/login-model';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends ServerErrorsBase {

  constructor(
    langService: LangService,
    iconService: IconService,
    authService: AuthService,
    router: Router,
    private messageService: MessageService
  ) {
    super(langService, iconService, authService, router);
    this.config(this.component.login);
  }

  login(input: ILoginModel): void {
    this.serverErrors = {} as IErrorModel;

    this.authService.login(input).subscribe({
      next: (res) => {
        if (res.token) {
          this.authService.setToken(res.token);
          this.messageService.event.emit(res.responseMessage);
          this.authService.logginEvent.emit(true);
          this.messageService.remindClicked.emit(true);
          this.router.navigateByUrl('profile');
        }
      },
      error: (err) => {
        if (err?.error) {
          // this.serverErrors = err.error;
          // this.setServerError();
          this.errors?.push(err.error[this.selectedLang]);
        };
      }
    });
  }
}
