import { Component, Input } from '@angular/core';
import { IChangeModel } from 'src/app/interfaces/change-model';
import { AuthService } from 'src/app/services/auth.service';
import { LangService } from 'src/app/services/lang.service';
import { MessageService } from 'src/app/services/message.service';
import { ServerErrorsBase } from '../base-classes/server-errors-base';
import { IPopupModel } from 'src/app/interfaces/popup-model';
import { IconService } from 'src/app/services/icon.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
//popup types: confirm, change, info
export class PopupComponent extends ServerErrorsBase  {
  @Input() input: IPopupModel = { visible: false, confirmed: false, type: '', getData: {} };

  //language
  menu: any = this.langService.get(this.selectedLang).popup;
  validations: any = this.langService.get(this.selectedLang).validations;

  icons: any = this.iconService.get('popup');

  constructor(langService: LangService, private authService: AuthService, private messageService: MessageService, private iconService: IconService) {
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

  info(): void {

  }

  confirm(): void {
    this.input.confirmed = true;
    this.exit();
  }

  exit() {
    this.input.visible = false;
  }

  override langListener(): void {
    this.subscription.push(this.langService.langEvent.subscribe(result => {
      this.menu = result.popup;
      this.validations = result.validations;
    }));
  }
}