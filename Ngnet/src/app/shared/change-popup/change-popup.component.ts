import { Component, Input } from '@angular/core';
import { IChangeModel } from 'src/app/interfaces/change-model';
import { IChangePopup } from 'src/app/interfaces/change-popup';
import { AuthService } from 'src/app/services/auth.service';
import { LangService } from 'src/app/services/lang.service';
import { MessageService } from 'src/app/services/message.service';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { ServerErrorsBase } from '../base-classes/server-errors-base';

@Component({
  selector: 'app-change-popup',
  templateUrl: './change-popup.component.html',
  styleUrls: ['./change-popup.component.scss']
})
export class ChangePopupComponent extends ServerErrorsBase  {
  @Input() input: IChangePopup = { visible: false };

  //language
  menu: any = this.langService.get(this.selectedLang).change;
  validations: any = this.langService.get(this.selectedLang).validations;

  closeIcon: any = faTimesCircle;

  constructor(langService: LangService, private authService: AuthService, private messageService: MessageService) {
    super(langService);
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

  override listener(): void {
    this.subscription.push(this.langService.langEvent.subscribe(result => {
      this.menu = result.change;
      this.validations = result.validations;
    }));
  }
}