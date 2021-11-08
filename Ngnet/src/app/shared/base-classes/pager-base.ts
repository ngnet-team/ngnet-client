import { Subscription } from "rxjs";
import { LangService } from "src/app/services/lang.service";
import { PagerService } from "src/app/services/pager.service";
import { ServerErrorsBase } from "./server-errors-base";

export class PagerBase extends ServerErrorsBase {

  subscription: Subscription[] = [];

  constructor(public pagerService: PagerService, langService: LangService) {
    super(langService);
    this.pagerListener();
  }

  protected pagerListener(): void {
    this.subscription.push(this.pagerService.pageSelect.subscribe(result => {
        this.pagination();
    }));
  }

  protected pagination() {
    const items: any = {};
    const { skip, take } = this.pagerService.skipTake(items.length);
    return items.slice(skip, take);
  }
}