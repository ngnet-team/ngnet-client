import { EventEmitter, Injectable, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IPageModel } from '../../../interfaces/page-model';

@Injectable({
  providedIn: 'root'
})
export class PagerService {

  private model: IPageModel = { 
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

  getInstance() { return this.model };

  skipTake(model: IPageModel, length: number): { skip: number, take: number } {
    model.totalPages = this.setPageNumbers(model, length).totalPages;

    let skip = (model.pageNumber - 1) * model.perPage;
    let take = model.pageNumber * model.perPage;

    if (skip >= length) {
      skip = 0;
    }

    if (take > length) {
      take = length;
    }

    return { skip, take }
  }

  setPageNumbers(model: IPageModel, length: number): IPageModel {
    model.numbers = [];
    const pages = Math.ceil(length / model.perPage);
    for (let i = 1; i <= pages; i++) {
      model.numbers.push(i);
    }
    model.totalPages = model.numbers.length;
    //show pager
    model.visible = model.numbers.length > 1 ? true : false;
    return model;
  }

  pageClick(model: IPageModel, page: number): void {
    model.pageNumber = page;
    this.pageSelect.emit(page)
  }
  
  public validatePage(model: IPageModel, page: number): number | null {
    const start: number | null = 1;
    const end: number | null = model.totalPages;

    return page < start ? null : page > end ? null : page;
  }

  setPerPage(model: IPageModel, counts: number): IPageModel {
    if (counts > 0) {
      model.perPage = counts;
    }
    return model;
  }
}
