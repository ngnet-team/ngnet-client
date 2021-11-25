import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ICareModel } from 'src/app/interfaces/care/care-model';
import { ITimeModel } from 'src/app/interfaces/time-model';
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
  healthRems: ICareModel[] = [];

  constructor(private messageService: MessageService) {
    this.subscriptionListener();
    this.getReminders();
  }

  getReminders(): void {
    this.messageService.getReminders(this.time).subscribe(res => {
      this.healthRems = res;
    });
  }

  private subscriptionListener(): void {
    this.event.push(this.messageService.notificationEvent.subscribe(visible => {
      this.visible = visible;
    }));
  }
}
