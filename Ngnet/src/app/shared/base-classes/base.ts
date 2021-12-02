import { Subscription } from "rxjs";
import { IChangeModel } from "src/app/interfaces/change-model";
import { LangService } from "../../services/lang.service";

export class Base {

  subscription: Subscription[] = [];
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
    care: 'care',
    nav: 'nav',
    notification: 'notification',
    company: 'company',
    dropdown: 'dropdown',
    page: 'page',
    popup: 'popup',
  };

  constructor(protected langService: LangService) {
    this.langListener();
  }

  public langListener(field: string = this.component.none): void {
    this.subscription.push(this.langService.langEvent.subscribe(result => {
      this.selectedLang = result.language;
      this.validations = result.validations;
      this.menu = result[field];
    }));
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
}