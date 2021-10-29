import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IErrorModel } from 'src/app/interfaces/response-error-model';
import { LangService } from 'src/app/services/lang.service';
import { MessageService } from 'src/app/services/message.service';
import { IRegisterModel } from '../../interfaces/auth/register-model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  langEvent: Subscription[] = [];
  serverErrors: IErrorModel = {};
  //language
  selectedLang: string = this.langService.langState;
  errors: string[] | undefined;
  menu: any = this.langService.get(this.selectedLang).register;
  validations: any = this.langService.get(this.selectedLang).validations;

  constructor(private authService: AuthService, private route: Router, private langService: LangService, private messageService: MessageService) {
    this.langListener();
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

  private setServerError() {
    this.errors = this.selectedLang === 'bg' ? this.serverErrors.bg : this.serverErrors.en;
  }

  private langListener(): void {
    this.langEvent.push(this.langService.langEvent.subscribe(result => {
      this.selectedLang = this.langService.langState;
      this.menu = result.register;
      this.validations = result.validations;
      this.setServerError();
    }))
  }

  redirectToLogin(): void {
    this.route.navigateByUrl('login');
  }
}
