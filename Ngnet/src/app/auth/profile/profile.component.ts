import { Component, DoCheck, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IUserRequestModel } from 'src/app/interfaces/auth/user-request-model';
import { IChangeModel } from 'src/app/interfaces/change-model';
import { IPopupModel } from 'src/app/interfaces/popup-model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FileService } from 'src/app/services/common/file/file.service';
import { IconService } from 'src/app/services/common/icon/icon.service';
import { LangService } from 'src/app/services/common/lang/lang.service';
import { MessageService } from 'src/app/services/common/message/message.service';
import { ServerErrorsBase } from 'src/app/shared/base-classes/server-errors-base';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends ServerErrorsBase implements DoCheck {

  @Output() changePopup: IPopupModel = { visible: false, confirmed: false, type: 'change', getData: { from: 'profile' } };

  constructor(
    langService: LangService,
    iconService: IconService,
    authService: AuthService,
    router: Router,
    fileService: FileService,
    private messageService: MessageService,
    private route: ActivatedRoute
    ) {
    super(langService, iconService, authService, router, fileService);
    this.config(this.component.profile);
    this.data = this.route.snapshot.data.profile;
  }

  ngDoCheck(): void {
    if (this.changePopup.returnData) {
      console.log(this.changePopup)
      this.change(this.changePopup.returnData);
      this.changePopup.returnData = undefined;
    }
  }

  update(input: IUserRequestModel): void {
    this.authService.update(input).subscribe({
      next: (res) => {
        this.messageService.event.emit(res);
        this.getProfile();
      },
      error: (err) => {
        if (err?.error?.errors) {
          this.unhandledServerError(err?.error.errors);
        } else if (err?.error) {
          this.serverError = err.error[this.selectedLang];
        };
      }
    });
  }

  change(input: IChangeModel): void {
    const data = {
      id: this.authService.getParsedJwt()?.userId,
      key: input.key,
      old: input.old,
      new: input.new,
    };

    this.authService.change(data).subscribe({
      next: (res) => {
        const msg = this.messageService.getMsg(res, this.selectedLang);
        this.messageService.event.emit(msg);
        this.getProfile();
      },
      error: (err) => {
        if (err?.error?.errors) {
          this.unhandledServerError(err?.error.errors);
        } else if (err?.error) {
          this.serverError = err.error[this.selectedLang];
        };
      }
    });
  }

  openChangePopup(label: string, key: string) {
    this.changePopup.getData = {
      label: label.toLowerCase(),
      key: key,
      repeat: true,
    };

    if (key === 'email') {
      this.changePopup.getData.value = this.data.email;
    }

    this.changePopup.visible = true;
    this.errors = undefined;
  }

  private getProfile(): void {
    this.authService.profile().subscribe(res => {
      this.data = res;
    });
    this.errors = [];
  }
}
