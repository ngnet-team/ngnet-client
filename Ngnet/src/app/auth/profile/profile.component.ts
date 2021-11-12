import { Component, DoCheck, Output } from '@angular/core';
import { IUserRequestModel } from 'src/app/interfaces/auth/user-request-model';
import { IUserResponseModel } from 'src/app/interfaces/auth/user-response-model';
import { IChangeModel } from 'src/app/interfaces/change-model';
import { IPopupModel } from 'src/app/interfaces/popup-model';
import { AuthService } from 'src/app/services/auth.service';
import { LangService } from 'src/app/services/lang.service';
import { MessageService } from 'src/app/services/message.service';
import { ServerErrorsBase } from 'src/app/shared/base-classes/server-errors-base';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends ServerErrorsBase implements DoCheck {
  @Output() popup: IPopupModel = { visible: false, confirmed: false, type: 'change', getData: { from: 'profile' } };

  user: IUserResponseModel = {};

  //language
  menu: any = this.langService.get(this.selectedLang).profile;
  validations: any = this.langService.get(this.selectedLang).validations;

  constructor(private authService: AuthService, langService: LangService, private messageService: MessageService) {
    super(langService);
    this.getProfile();
  }

  ngDoCheck(): void {
    // get the returned new value when popup is closed
    if (this.popup.returnData && !this.popup.visible) {

      const changeModel = {
        old: this.popup.returnData.old,
        new: this.popup.returnData.new,
        repeatNew: this.popup.returnData.repeatNew,
        value: this.popup.getData.type,
      } as IChangeModel;

      this.change(changeModel);
      this.popup.returnData = undefined;
    }
  }

  override langListener(): void {
    this.subscription.push(this.langService.langEvent.subscribe(result => {
      this.menu = result.profile;
    }))
  }

  update(input: IUserRequestModel): void {
    console.log(input);
    this.authService.update(input).subscribe({
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

  openPopup(label: string, type: string) {
    this.popup.getData = {
      label: label.toLowerCase(),
      type: type,
    };

    if (type === 'email') {
      this.popup.getData.value = this.user.email;
    }

    this.popup.type = 'change';
    this.popup.visible = true;
    this.errors = [];
  }

  private getProfile(): void {
    this.authService.profile().subscribe(res => {
      this.user = res;
    });
    this.errors = [];
  }
}
