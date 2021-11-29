import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ICareModel } from 'src/app/interfaces/care/care-model';
import { ITimeModel } from 'src/app/interfaces/time-model';
import { IconService } from 'src/app/services/icon.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {

  visible: boolean = false;
  event: Subscription[] = [];
  time: ITimeModel = { days: 0 };
  careRems: ICareModel[] = [];
  icons: any = this.iconService.get('popup');

  constructor(private messageService: MessageService, private iconService: IconService) {
    this.subscriptionListener();
    this.getReminders();
  }

  getReminders(): void {
    this.messageService.getReminders(this.time).subscribe(res => {
      this.careRems = res;
      this.messageService.notificationCount.emit(this.careRems.length);
    });
  }

  exit(care: ICareModel): void {
    this.careRems = this.careRems.map(x => {
      if (x.id === care.id) {
        x.read = true;
      }
      return x;
    }).filter(x => !x.read);
  }

  private subscriptionListener(): void {
    this.event.push(this.messageService.notificationVisibility.subscribe(visible => {
      this.visible = visible;
    }));
  }
}
