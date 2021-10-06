import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  event: EventEmitter<string> = new EventEmitter();
  
  constructor() { }

  getMsg(response: { bg: string[], en: string[] }, language: string): string {
    if (!response) {
      return '';
    }
    return language === environment.lang.bg ? response.bg[0] : response.en[0];
  }
}
