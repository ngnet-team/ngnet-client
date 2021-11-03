import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IChangeModel } from 'src/app/interfaces/change-model';
import { IChangePopup } from 'src/app/interfaces/change-popup';
import { IErrorModel } from 'src/app/interfaces/response-error-model';
import { AuthService } from 'src/app/services/auth.service';
import { LangService } from 'src/app/services/lang.service';
import { MessageService } from 'src/app/services/message.service';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-change-popup',
  templateUrl: './change-popup.component.html',
  styleUrls: ['./change-popup.component.scss']
})
export class ChangePopupComponent {
  @Input() input: IChangePopup = { visible: false };

  serverErrors: IErrorModel = {};
  errors: string[] | undefined;
  //language
  selectedLang: string = this.langService.langState;
  menu: any = this.langService.get(this.selectedLang).change;
  validations: any = this.langService.get(this.selectedLang).validations;
  //subscription
  subscription: Subscription[] = [];
  closeIcon: any = faTimesCircle;

  constructor(private route: Router, private langService: LangService, private authService: AuthService, private messageService: MessageService) {
    this.listener();
  }

  change(input: IChangeModel): void {

    input.value = this.input.value;

    this.authService.change(input).subscribe({
      next: (res) => {
        const msg = this.messageService.getMsg(res, this.selectedLang);
        this.messageService.event.emit(msg);
        this.exit();
      },
      error: (err) => {
        if (err?.error?.errors) {
          this.unhandledServerError(err?.error.errors);
        } else if (err?.error) {
          this.serverErrors = err?.error;
          this.setServerError();
        };
      }
    });
  }

  exit() {
    this.input.visible = false;
  }

  private listener(): void {
    this.subscription.push(this.langService.langEvent.subscribe(result => {
      this.selectedLang = result.language;
      this.menu = result.change;
      this.validations = result.validations;
    }));
  }

  private setServerError() {
    if (typeof this.serverErrors === 'string') {
      this.errors = [ this.serverErrors ];
    } else {
      this.errors = this.selectedLang === 'bg' ? this.serverErrors?.bg : this.serverErrors?.en;
    }
  }

  private unhandledServerError(errors: any) {
    for (const key in errors) {
      this.errors = errors[key];
    }
  }
}