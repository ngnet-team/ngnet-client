import { Component, Input } from '@angular/core';
import { IConfirmPopup } from 'src/app/interfaces/popup/confirm-popup';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { LangService } from 'src/app/services/lang.service';
import { LangBase } from '../base-classes/lang-base';

@Component({
  selector: 'app-confirm-popup',
  templateUrl: './confirm-popup.component.html',
  styleUrls: ['./confirm-popup.component.scss']
})
export class ConfirmPopupComponent extends LangBase {

  @Input() input: IConfirmPopup = { visible: false, confirmed: false };

  //language
  menu: any = this.langService.get(this.selectedLang).popup;

  closeIcon: any = faTimesCircle;

  constructor(langService: LangService) {
    super(langService);
   }

  confirm(): void {
    this.input.confirmed = true;
    this.input.visible = false;
  }

  exit() {
    this.input.visible = false;
  }

  override langListener(): void {
    this.subscription.push(this.langService.langEvent.subscribe(result => {
      this.menu = result.change;
    }));
  }
}
