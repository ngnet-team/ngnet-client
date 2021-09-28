import { EventEmitter, Injectable, Output } from '@angular/core';
import { IPageModel } from '../interfaces/page-model';

@Injectable({
  providedIn: 'root'
})
export class PagerService {

  model: IPageModel = { length: 0, perPage: 5, pageNumber: 1, numbers: [], totalPages: 0 };
  @Output() pageSelect: EventEmitter<number> = new EventEmitter();
  
  constructor() { }

  skipTake(length: number): { skip: number, take: number } {
    const skip = (this.model.pageNumber - 1) * this.model.perPage;
    const take = this.model.pageNumber * this.model.perPage;

    if (take > length) {
      return { skip, take: length }
    }

    return { skip, take }
  }

  setPageNumbers(length: number): number {
    this.model.numbers = [];
    const pages = Math.ceil(length / this.model.perPage);
    for (let i = 1; i <= pages; i++) {
      this.model.numbers.push(i);
    }
    return this.model.numbers.length;
  }

  pageClick(page: number) {
    this.model.pageNumber = page;
    this.pageSelect.emit(page)
  }
}
