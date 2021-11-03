import { Component, DoCheck, Output } from '@angular/core';
import { IUserRequestModel } from 'src/app/interfaces/auth/user-request-model';
import { IUserResponseModel } from 'src/app/interfaces/auth/user-response-model';
import { IChangePopup } from 'src/app/interfaces/change-popup';
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
  @Output() popup: IChangePopup = { visible: false };

  user: IUserResponseModel = {};

  //language
  menu: any = this.langService.get(this.selectedLang).profile;
  validations: any = this.langService.get(this.selectedLang).validations;

  constructor(private authService: AuthService, langService: LangService, private messageService: MessageService) {
    super(langService);
    this.getProfile();
  }

  ngDoCheck(): void {
    // reload personal details once
    if (this.popup.data && !this.popup.visible) {
      this.popup.data = '';
      this.getProfile();
    }
  }

  getProfile(): void {
    this.authService.profile().subscribe(res => {
      this.user = res;
    });
  }

  override listener(): void {
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
      },
      error: (err) => {
        if (err?.error) {
          this.serverErrors = err?.error;
          this.setServerError();
        };
      }
    });
  }

  change(menu: string, value: string) {

    if (value === 'email') {
      this.popup.data = this.user.email;
    }

    this.popup.visible = true;
    this.popup.value = value.toLowerCase();
    this.popup.menu = menu.toLowerCase();
  }
}
