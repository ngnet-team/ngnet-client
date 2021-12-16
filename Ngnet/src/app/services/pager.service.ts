import { EventEmitter, Injectable, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IPageModel } from '../interfaces/page-model';

@Injectable({
  providedIn: 'root'
})
export class PagerService {

  model: IPageModel = { 
    visible: false,
    length: 0, 
    perPage: environment.pagination.countsPerPage, 
    pageNumber: 1, 
    numbers: [], 
    totalPages: 0 
  };

  scope: number = 2;
  
  @Output() pageSelect: EventEmitter<number> = new EventEmitter();
  
  constructor() {}

  skipTake(length: number): { skip: number, take: number } {
    this.model.totalPages = this.setPageNumbers(length);

    let skip = (this.model.pageNumber - 1) * this.model.perPage;
    let take = this.model.pageNumber * this.model.perPage;

    if (skip >= length) {
      skip = 0;
    }

    if (take > length) {
      take = length;
    }

    return { skip, take }
  }

  setPageNumbers(length: number): number {
    this.model.numbers = [];
    const pages = Math.ceil(length / this.model.perPage);
    for (let i = 1; i <= pages; i++) {
      this.model.numbers.push(i);
    }
    //show pager
    this.model.visible = this.model.numbers.length > 1 ? true : false;
    return this.model.numbers.length;
  }

  pageClick(page: number) {
    this.model.pageNumber = page;
    this.pageSelect.emit(page)
  }
  
  public validatePage(page: number): number | null {
    const start: number | null = 1;
    const end: number | null = this.model.totalPages;

    return page < start ? null : page > end ? null : page;
  }

  setPerPage(counts: number) {
    if (counts > 0) {
      this.model.perPage = counts;
    }
  }

  reset() {
    this.model.pageNumber = 1;
  }
}
