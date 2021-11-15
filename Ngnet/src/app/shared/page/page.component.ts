import { Component, DoCheck, Input, Output } from '@angular/core';
import { IPageModel } from 'src/app/interfaces/page-model';
import { PagerService } from 'src/app/services/pager.service';
import { IconService } from 'src/app/services/icon.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements DoCheck {

  @Input() pager: IPageModel = { visible: false, length: 0, numbers: [], perPage: 0, pageNumber: 0, totalPages: 0 };
  @Output() pageSelect: number = 1;

  icons: any = this.iconService.get('pager');

  constructor(public pagerService: PagerService, private iconService: IconService) { }

  ngDoCheck(): void {
  }

  pageClick(page: number) {
    if (!this.pagerService.validatePage(page)) { return; };
    
    this.pageSelect = page;
    
    console.log(this.pageSelect);
    this.pagerService.pageClick(page);
  }

  pagesView(): number[] {
    const index = this.pager.numbers.indexOf(this.pageSelect);
    const currPage = this.pager.numbers[index];

    let from = currPage - this.pagerService.scope;
    //transfer pages if not enough counts to the end
    const transferCounts = this.pagerService.scope - (this.pager.numbers.length - currPage);
    if (transferCounts > 0) {
      from -= transferCounts;
    }

    let to = currPage + this.pagerService.scope;

    const view: number[] = [];
    for (let num = from; num <= to; num++) {
      if (this.pagerService.validatePage(num)) {
        view.push(num);
      }
      //add more pages if needed
      if (num < 1) {
        to += 1;
      }
    }

    return view;
  }
}
