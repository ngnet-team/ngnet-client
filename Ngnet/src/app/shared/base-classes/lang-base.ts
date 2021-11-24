import { Subscription } from "rxjs";
import { IChangeModel } from "src/app/interfaces/change-model";
import { LangService } from "../../services/lang.service";

export class LangBase {

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
  protected confirmPopupChecker(popup: any) {
    let confirmed = false;
    let switcher = false;

    if (popup.confirmed) {
      confirmed = true;
      if (popup.getData.switcher) {
        switcher = true;
      }
      popup.getData.switcher = false;
      popup.confirmed = false;
    }

    return { confirmed, switcher };
  }

  //getData.repeat: true or false
  protected changePopupChecker(popup: any) {
    let changed = false;
    let repeat = false;
    const model: IChangeModel = {};

    if (popup.returnData && !popup.visible) {
      changed = true;
      model.old = popup.returnData.old;
      model.new = popup.returnData.new;
      model.value = popup.getData.type;
      if (popup.getData.repeat) {
        repeat = true;
        model.repeatNew = popup.returnData.repeatNew;
      }
      popup.returnData = undefined;
    }

    return { changed, repeat, model };
  }
}