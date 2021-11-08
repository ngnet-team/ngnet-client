import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IErrorModel } from 'src/app/interfaces/response-error-model';
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

  //language
  menu: any = this.langService.get(this.selectedLang).register;
  validations: any = this.langService.get(this.selectedLang).validations;

  constructor(private authService: AuthService, private route: Router, langService: LangService, private messageService: MessageService) {
    super(langService);
  }

  register(input: IRegisterModel): void {
    this.serverErrors = {} as IErrorModel;

    this.authService.register(input).subscribe({
      next: (res) => {
        const msg = this.messageService.getMsg(res, this.selectedLang);
        this.messageService.event.emit(msg);
        this.redirectToLogin();
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
      this.menu = result.register;
      this.validations = result.validations;
      this.setServerError();
    }))
  }

  redirectToLogin(): void {
    this.route.navigateByUrl('login');
  }
}
