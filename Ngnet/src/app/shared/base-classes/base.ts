import { Subscription } from "rxjs";
import { IChangeModel } from "src/app/interfaces/change-model";
import { LangService } from "../../services/lang.service";

export class Base {

  selectedLang: string = this.langService.langState;
  subscription: Subscription[] = [];

  constructor(protected langService: LangService) {
    this.langListener();
  }

  protected langListener(): void {
    this.subscription.push(this.langService.langEvent.subscribe(result => {
      this.selectedLang = result.language;
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