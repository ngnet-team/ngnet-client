import { Subscription } from "rxjs";
import { LangService } from "src/app/services/lang.service";
import { PagerService } from "src/app/services/pager.service";
import { ServerErrorsBase } from "./server-errors-base";

export class PagerBase extends ServerErrorsBase {

  subscription: Subscription[] = [];
  //fake param
  input: any;

  constructor(public pagerService: PagerService, langService: LangService) {
    super(langService);
    this.pagerListener(this.input);
  }

  protected pagerListener(pagedItems: any): void {
    this.subscription.push(this.pagerService.pageSelect.subscribe(result => {
      pagedItems = this.pagination(this.input);
    }));
  }

  protected pagination(input: any): any {
    const { skip, take } = this.pagerService.skipTake(input.length);
    return input.slice(skip, take);
  }
}