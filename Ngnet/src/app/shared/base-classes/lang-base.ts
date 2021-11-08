import { Subscription } from "rxjs";
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
}