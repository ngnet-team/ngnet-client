import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/services/auth/auth.service";
import { IconService } from "src/app/services/common/icon/icon.service";
import { LangService } from "src/app/services/common/lang/lang.service";
import { PagerService } from "src/app/services/components/pager/pager.service";
import { ServerErrorsBase } from "./server-errors-base";
import { IPageModel } from "src/app/interfaces/page-model";
import { FileService } from "src/app/services/common/file/file.service";

export class PagerBase extends ServerErrorsBase {

  subscription: Subscription[] = [];
  //fake param
  input: any;
  pager: IPageModel = this.pagerService.getInstance();

  constructor(
    protected langService: LangService, 
    protected iconService: IconService,
    protected authService: AuthService,
    protected router: Router, 
    protected fileService: FileService,
    protected pagerService: PagerService) {
    super(langService, iconService, authService, router, fileService);
    this.pagerListener(this.input);
  }

  protected pagerListener(pagedItems: any): void {
    this.subscription.push(this.pagerService.pageSelect.subscribe(result => {
      pagedItems = this.pagination(this.pager, this.input);
    }));
  }

  protected pagination(pager: IPageModel, input: any): any {
    const { skip, take } = this.pagerService.skipTake(pager, input.length);
    return input.slice(skip, take);
  }

  protected configPager(component: string = this.component.none, perPage: number = 4): IPageModel {
    super.config(component);
    return this.pagerService.setPerPage(this.pagerService.getInstance(), perPage);
  }
}