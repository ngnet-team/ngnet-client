import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { IChangeModel } from "src/app/interfaces/change-model";
import { IPopupModel } from "src/app/interfaces/popup-model";
import { AuthService } from "src/app/services/auth/auth.service";
import { IconService } from "src/app/services/common/icon/icon.service";
import { LangService } from "../../services/common/lang/lang.service";

export class Base {

  subscription: Subscription[] = [];
  data: any;
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
    posts: 'posts',
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

  protected popupHandler(popup: IPopupModel): any {
    if (popup.visible) {
      return;
    }

    var result = { 
      visible: false, 
      confirmed: false, 
      type: popup.type, 
      getData: { from: popup.getData.from },
      returnData: popup.returnData
    };

    switch (popup.type) {
      // -------- Form -------- 
      case 'form':
        break;
      // -------- Confirm -------- 
      case 'confirm':
        break;
      // -------- Change -------- 
      // case 'change':
      //   if (popup.returnData) {
      //     let changed = true;
      //     let repeat = popup.getData.repeat;

      //     const model: IChangeModel = {
      //       old: popup.returnData.old,
      //       new: popup.returnData.new,
      //       key: popup.getData.type,

      //     };
      //     if (repeat) {
      //       model.repeatNew = popup.returnData.repeatNew;
      //     }

      //     result.returnData = model;

      //     result = { changed, repeat, model };
      //   }
      //   break;
      default:
        break;
    }

    return result;
  }

  protected langListener(component: string = this.component.none): void {
    this.menu = this.menu[component];

    this.subscription.push(this.langService.langEvent.subscribe(result => {
      this.selectedLang = result.language;
      this.validations = result.validations;
      this.menu = result[component];
    }));
  }

  protected assignUserId(obj: any) {
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