import { Component, Input } from '@angular/core';
import { IChangeModel } from 'src/app/interfaces/change-model';
import { LangService } from 'src/app/services/common/lang/lang.service';
import { ServerErrorsBase } from '../base-classes/server-errors-base';
import { IPopupModel } from 'src/app/interfaces/popup-model';
import { IconService } from 'src/app/services/common/icon/icon.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FileService } from 'src/app/services/common/file/file.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
//popup types: confirm, change, info
export class PopupComponent extends ServerErrorsBase  {
  @Input() input: IPopupModel = { type: '', visible: false };
  file: any;

  constructor(
    langService: LangService,
    iconService: IconService,
    authService: AuthService,
    router: Router,
    fileService: FileService,
    ) {
    super(langService, iconService, authService, router, fileService);
    this.config(this.component.popup);
  }

  form(input: any): void {
    // const imageFile = this.fileService.set(this.file);
    // this.input.returnData.image = imageFile;

    this.input.returnData = input;
    this.input.returnData.meta = this.input.getData?.meta;
    
    this.exit();
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
  }

  change(input: IChangeModel): void {
    if (input.repeatNew && input.new !== input.repeatNew) {
      return;
    }
    this.input.returnData = this.input.getData;
    this.input.returnData.old = input.old;
    this.input.returnData.new = input.new;
    this.exit();
  }

  info(): void {

  }

  confirm(): void {
    this.input.confirmed = true;
    this.input.returnData = this.input.getData;

    this.exit();
  }

  exit() {
    this.input.visible = false;
    this.input.getData = undefined;
  }
}