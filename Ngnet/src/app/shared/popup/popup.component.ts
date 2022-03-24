import { Component, Input, Output } from '@angular/core';
import { IChangeModel } from 'src/app/interfaces/change-model';
import { LangService } from 'src/app/services/common/lang/lang.service';
import { ServerErrorsBase } from '../base-classes/server-errors-base';
import { IPopupModel } from 'src/app/interfaces/popup-model';
import { IconService } from 'src/app/services/common/icon/icon.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
//popup types: confirm, change, info
export class PopupComponent extends ServerErrorsBase  {
  @Input() input: IPopupModel = { type: '', visible: false };

  constructor(
    langService: LangService,
    iconService: IconService,
    authService: AuthService,
    router: Router,
    ) {
    super(langService, iconService, authService, router);
    this.config(this.component.popup);
  }

  create(input: any): void {
    if (!input.title && !input.content) {
      return;
    }

    this.input.returnData = {
      title: input.title,
      content: input.content,
    };

    this.exit();
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

  confirm(): void {
    this.input.confirmed = true;
    this.input.returnData = this.input.getData;
    this.input.getData = undefined;
    this.exit();
  }

  exit() {
    this.input.visible = false;
  }
}