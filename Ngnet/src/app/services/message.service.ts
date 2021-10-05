import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  event: EventEmitter<string> = new EventEmitter();
  
  constructor() { }
}
