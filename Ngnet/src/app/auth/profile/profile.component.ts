import { Component, DoCheck, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IUserRequestModel } from 'src/app/interfaces/auth/user-request-model';
import { IChangeModel } from 'src/app/interfaces/change-model';
import { IPopupModel } from 'src/app/interfaces/popup-model';
import { AuthService } from 'src/app/services/auth/auth.service';
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
    private messageService: MessageService,
    private route: ActivatedRoute
    ) {
    super(langService, iconService, authService, router);
    this.config(this.component.profile);
    this.data = this.route.snapshot.data.profile;
  }

  ngDoCheck(): void {
    //CHANGE popup
    // const changePopup = this.changePopupChecker(this.changePopup);
    // if (changePopup.repeat) {
    //   this.change(changePopup.model);
    // }
  }

  update(input: IUserRequestModel): void {
    this.authService.update(input).subscribe({
      next: (res) => {
        console.log(res)
        const msg = this.messageService.getMsg(res, this.selectedLang);
        this.messageService.event.emit(msg);
        this.getProfile();
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

  change(input: IChangeModel): void {

    this.authService.change(input).subscribe({
      next: (res) => {
        const msg = this.messageService.getMsg(res, this.selectedLang);
        this.messageService.event.emit(msg);
        this.getProfile();
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

  openChangePopup(label: string, type: string) {
    this.changePopup.getData = {
      label: label.toLowerCase(),
      type: type,
      repeat: true,
    };

    if (type === 'email') {
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
