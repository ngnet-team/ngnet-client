import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/services/modules/auth/auth.service";
import { IconService } from "src/app/services/common/icon/icon.service";
import { LangService } from "src/app/services/common/lang/lang.service";
import { PagerService } from "src/app/services/components/pager/pager.service";
import { ServerErrorsBase } from "./server-errors-base";

export class PagerBase extends ServerErrorsBase {

  subscription: Subscription[] = [];
  //fake param
  input: any;

  constructor(
    protected langService: LangService, 
    protected iconService: IconService,
    protected authService: AuthService,
    protected router: Router, 
    protected pagerService: PagerService) {
    super(langService, iconService, authService, router);
    this.pagerListener(this.input);
    this.pagerService.reset();
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

  protected configPager(component: string = this.component.none, perPage: number = 4) {
    super.config(component);
    this.pagerService.setPerPage(perPage);
  }
}