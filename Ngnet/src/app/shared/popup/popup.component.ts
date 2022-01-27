import { Component, Input } from '@angular/core';
import { IChangeModel } from 'src/app/interfaces/change-model';
import { LangService } from 'src/app/services/lang.service';
import { ServerErrorsBase } from '../base-classes/server-errors-base';
import { IPopupModel } from 'src/app/interfaces/popup-model';
import { IconService } from 'src/app/services/icon.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
//popup types: confirm, change, info
export class PopupComponent extends ServerErrorsBase  {
  @Input() input: IPopupModel = { visible: false, confirmed: false, type: '', getData: undefined };

  constructor(
    langService: LangService,
    iconService: IconService,
    authService: AuthService,
    router: Router,
    ) {
    super(langService, iconService, authService, router);
    this.config(this.component.popup);
  }

  change(input: IChangeModel): void {
    if (input.repeatNew && input.new !== input.repeatNew) {
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

  confirm(switcher: boolean = false): void {
    if (switcher) {
      return;
      this.input.getData.switcher = switcher;
    }

    this.input.confirmed = true;
    this.exit();
  }

  exit() {
    this.input.visible = false;
  }
}