import { Component, DoCheck, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IPageModel } from 'src/app/interfaces/page-model';
import { IconService } from 'src/app/services/common/icon/icon.service';
import { LangService } from 'src/app/services/common/lang/lang.service';
import { PagerService } from 'src/app/services/components/pager/pager.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PagerBase } from '../base-classes/pager-base';
import { IDashboardModel } from 'src/app/interfaces/shared/dashboard-model';
import { IDashboardContentModel } from 'src/app/interfaces/shared/dashboard-content-model';
import { IDashboardHeaderModel } from 'src/app/interfaces/shared/dashboard-header-model';
import { IDashboardContentCellModel } from 'src/app/interfaces/shared/dashboard-content-cell-model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends PagerBase implements DoCheck {

  @Input() input: IDashboardModel = {};
  @Output() pager: IPageModel = {
    visible: false,
    length: 0,
    perPage: 0,
    numbers: [],
    pageNumber: 0,
    totalPages: 0
  };

  content: IDashboardContentModel[] | undefined;
  filteredContent: IDashboardContentModel[] = [];
  pagedContent: IDashboardContentModel[] = [];
  icons: any = this.iconService.get(this.component.dashboard);
  descSort: boolean = false; 

  constructor(
    langService: LangService,
    iconService: IconService,
    authService: AuthService,
    router: Router,
    pagerService: PagerService,
  ) {
    super(langService, iconService, authService, router, pagerService);
    this.pager = this.configPager(this.component.dashboard, 4);
  }

  ngDoCheck(): void {
    if (this.input.content && !this.content) {
      this.content = this.input.content;
      this.pagedContent = this.pagination(this.pager, this.content);
    }
  }

  changePopup(value: string | undefined) {
    console.log(value);
  }

  sort(value: IDashboardHeaderModel) {
    const idx = (this.input.header?.indexOf(value) as number);
    this.pagedContent = this.pagedContent.sort((a, b) => {

      const first = (a.row as IDashboardContentCellModel[])[idx];
      const second = (b.row as IDashboardContentCellModel[])[idx];

      if (first.name && second.name) {
        if (this.descSort) {
          this.descSort = !this.descSort;
          return second.name < first.name ? 1 : -1;
        } else {
          this.descSort = !this.descSort;
          return first.name < second.name ? 1 : -1;
        }
      }
      return 1;
    });
  }

  override pagerListener(): void {
    this.subscription.push(this.pagerService.pageSelect.subscribe(pageNumber => {
      this.pager.pageNumber = pageNumber;
      this.pagedContent = this.pagination(this.pager, this.content);
    }));
  }
}
