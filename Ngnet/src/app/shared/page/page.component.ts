import { Component, DoCheck, Input, Output } from '@angular/core';
import { IPageModel } from 'src/app/interfaces/page-model';
import { PagerService } from 'src/app/services/pager.service';
import { faAngleDoubleLeft, faAngleLeft, faAngleRight, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements DoCheck {

  @Input() pager: IPageModel = { length: 0, numbers: [], perPage: 0, pageNumber: 0, totalPages: 0 };
  @Output() pageSelect: number = 0;

  hide: boolean = this.pager.numbers.length <= 1;

  arrows: any = { leftDouble: faAngleDoubleLeft, left: faAngleLeft, right: faAngleRight, rightDouble: faAngleDoubleRight }

  constructor(public pagerService: PagerService) {}

  ngDoCheck(): void {
    this.hide = this.pager.numbers.length <= 1;
  }

  pageClick(page: number) {
    page = this.validatePage(page);

    if (page === 0) {
      return;
    }

    this.pagerService.pageClick(page);
  }

  private validatePage(page: number): number {
    const start: number = 1;
    const end: number = this.pagerService.model.totalPages;

    return page < start ? 0 : page > end ? 0 : page;
  }
}
