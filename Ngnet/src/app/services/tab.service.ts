import { EventEmitter, Injectable } from '@angular/core';
import { ITabModel } from '../interfaces/tab-model';

@Injectable({
  providedIn: 'root'
})
export class TabService {
  
  event: EventEmitter<ITabModel> = new EventEmitter();

  constructor() { }
}
