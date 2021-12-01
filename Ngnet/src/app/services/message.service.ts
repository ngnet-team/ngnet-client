import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ITimeModel } from '../interfaces/time-model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private msgUrl: string = environment.serverUrl + 'message';
  //events
  event: EventEmitter<string> = new EventEmitter();
  notificationVisibility: EventEmitter<boolean> = new EventEmitter();
  notificationCount: EventEmitter<number> = new EventEmitter();
  remindClicked: EventEmitter<boolean> = new EventEmitter();
  
  constructor(private http: HttpClient) { }

  getMsg(response: { bg: string[], en: string[] }, language: string): string {
    if (!response) {
      return '';
    }
    return language === environment.lang.bg ? response.bg[0] : response.en[0];
  }

  getReminders(time: ITimeModel): Observable<any> {
    return this.http.post(this.msgUrl + '/getReminders', time);
  }
}
