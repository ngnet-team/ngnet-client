import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { IChangeModel } from "src/app/interfaces/change-model";
import { AuthService } from "src/app/services/modules/auth/auth.service";
import { IconService } from "src/app/services/common/icon/icon.service";
import { LangService } from "../../services/common/lang/lang.service";

export class Base {

  subscription: Subscription[] = [];
  icons: any;
  //language
  selectedLang: string = this.langService.langState;
  validations: any = this.langService.get(this.selectedLang).validations;
  menu: any = this.langService.get(this.selectedLang);
  //components
  component: any = {
    none: 'none',
    admin: 'admin',
    login: 'login',
    register: 'register',
    profile: 'profile',
    home: 'home',
    care: 'care',
    nav: 'nav',
    notification: 'notification',
    company: 'company',
    dropdown: 'dropdown',
    page: 'page',
    popup: 'popup',
    dashboard: 'dashboard',
  };

  constructor(
    protected langService: LangService,
    protected iconService: IconService,
    protected authService: AuthService,
    protected router: Router
  ) {
  }

  public redirect(path: string = 'not-found'): void {
    this.router.navigateByUrl(path);
  }

  protected config(component: string = this.component.none) {
    this.langListener(component);
    this.icons = this.iconService.get(component);
  }

  //getData.switcher: true or false
  protected confirmPopupChecker(popup: any): any {
    if (popup.confirmed) {
      let confirmed = popup.confirmed;
      let switcher = popup.getData.switcher;

      popup.getData.switcher = false;
      popup.confirmed = false;

      return { confirmed, switcher };
    }
    return {};
  }

  //getData.repeat: true or false
  protected changePopupChecker(popup: any): any {
    if (popup.returnData && !popup.visible) {
      let changed = true;
      let repeat = popup.getData.repeat;

      const model: IChangeModel = {
        old: popup.returnData.old,
        new: popup.returnData.new,
        value: popup.getData.type,

      };
      if (repeat) {
        model.repeatNew = popup.returnData.repeatNew;
      }

      popup.returnData = undefined;

      return { changed, repeat, model };
    }

    return {};
  }

  protected langListener(component: string = this.component.none): void {
    this.menu = this.menu[component];

    this.subscription.push(this.langService.langEvent.subscribe(result => {
      this.selectedLang = result.language;
      this.validations = result.validations;
      this.menu = result[component];
    }));
  }

  protected asignUserId(obj: any) {
    if (!obj) { return; }

    if (!Object.keys(obj).includes('userId')) {
      return;
    }

    if (!this.authService.user) {
      return;
    }

    obj.userId = this.authService.user?.userId;
    return obj;
  }
}