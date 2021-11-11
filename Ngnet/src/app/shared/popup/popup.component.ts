import { Component, Input } from '@angular/core';
import { IChangeModel } from 'src/app/interfaces/change-model';
import { AuthService } from 'src/app/services/auth.service';
import { LangService } from 'src/app/services/lang.service';
import { MessageService } from 'src/app/services/message.service';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { ServerErrorsBase } from '../base-classes/server-errors-base';
import { IPopupModel } from 'src/app/interfaces/popup-model';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent extends ServerErrorsBase  {
  @Input() input: IPopupModel = { visible: false, confirmed: false, type: '', getData: {} };

  //language
  menu: any = this.langService.get(this.selectedLang).popup;
  validations: any = this.langService.get(this.selectedLang).validations;

  closeIcon: any = faTimesCircle;

  constructor(langService: LangService, private authService: AuthService, private messageService: MessageService) {
    super(langService);
  }

  change(input: IChangeModel): void {
    if (input.new !== input.repeatNew) {
      return;
    }
    
    this.input.returnData = {
      old: input.old,
      new: input.new,
      repeatNew: input.repeatNew,
    };

    this.exit();
  }

  exit() {
    this.input.visible = false;
  }

  confirm(): void {
    this.input.confirmed = true;
    this.exit();
  }

  override langListener(): void {
    this.subscription.push(this.langService.langEvent.subscribe(result => {
      this.menu = result.popup;
      this.validations = result.validations;
    }));
  }
}