import { Component, Input } from '@angular/core';
import { IConfirmPopup } from 'src/app/interfaces/popup/confirm-popup';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { LangService } from 'src/app/services/lang.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-confirm-popup',
  templateUrl: './confirm-popup.component.html',
  styleUrls: ['./confirm-popup.component.scss']
})
export class ConfirmPopupComponent {

  @Input() input: IConfirmPopup = { visible: false, confirmed: false };

  //language
  selectedLang: string = this.langService.langState;
  menu: any = this.langService.get(this.selectedLang).popup;
  //subscription
  subscription: Subscription[] = [];
  closeIcon: any = faTimesCircle;

  constructor( private langService: LangService) {
    this.listener();
  }

  confirm(): void {
    this.input.confirmed = true;
    this.input.visible = false;
  }

  exit() {
    this.input.visible = false;
  }

  private listener(): void {
    this.subscription.push(this.langService.langEvent.subscribe(result => {
      this.selectedLang = result.language;
      this.menu = result.change;
    }));
  }
}
