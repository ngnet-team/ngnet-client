import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IErrorModel } from 'src/app/interfaces/response-error-model';
import { IconService } from 'src/app/services/icon.service';
import { LangService } from 'src/app/services/lang.service';
import { MessageService } from 'src/app/services/message.service';
import { ServerErrorsBase } from 'src/app/shared/base-classes/server-errors-base';
import { IRegisterModel } from '../../interfaces/auth/register-model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends ServerErrorsBase {

  constructor(
    langService: LangService,
    iconService: IconService,
    router: Router,
    private authService: AuthService, 
    private messageService: MessageService
  ) {
    super(langService, iconService, router);
    this.config(this.component.register);
  }

  register(input: IRegisterModel): void {
    this.serverErrors = {} as IErrorModel;

    this.authService.register(input).subscribe({
      next: (res) => {
        const msg = this.messageService.getMsg(res, this.selectedLang);
        this.messageService.event.emit(msg);
        this.redirect(this.component.login);
      },
      error: (err) => {
        if (err?.error) {
          this.serverErrors = err?.error;
          this.setServerError();
        };
      }
    });
  }
}
