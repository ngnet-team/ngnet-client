import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IErrorModel } from 'src/app/interfaces/response-error-model';
import { FileService } from 'src/app/services/common/file/file.service';
import { IconService } from 'src/app/services/common/icon/icon.service';
import { LangService } from 'src/app/services/common/lang/lang.service';
import { MessageService } from 'src/app/services/common/message/message.service';
import { ServerErrorsBase } from 'src/app/shared/base-classes/server-errors-base';
import { IRegisterModel } from '../../interfaces/auth/register-model';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends ServerErrorsBase {

  constructor(
    langService: LangService,
    iconService: IconService,
    authService: AuthService,
    router: Router, 
    fileService: FileService,
    private messageService: MessageService
  ) {
    super(langService, iconService, authService, router, fileService);
    this.config(this.component.register);
  }

  register(input: IRegisterModel): void {
    this.authService.register(input).subscribe({
      next: (res) => {
        const msg = this.messageService.getMsg(res, this.selectedLang);
        this.messageService.event.emit(msg);
        this.redirect(this.component.login);
      },
      error: (err) => {
        this.serverError = err?.error[this.selectedLang];
      }
    });
  }
}
