import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ICareModel } from 'src/app/interfaces/care/care-model';
import { ITimeModel } from 'src/app/interfaces/time-model';
import { CareService } from 'src/app/services/care/care.service';
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
  time: ITimeModel = { days: 5 };
  careRems: ICareModel[] = [];
  icons: any = this.iconService.get('popup');

  constructor(private messageService: MessageService, private iconService: IconService, private careService: CareService) {
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
    this.careService.remind(care).subscribe({
      next: (res) => {
        if (res) {
          this.getReminders();
          this.messageService.remindClicked.emit(true);
        }
      }
    });
  }

  private subscriptionListener(): void {
    this.event.push(this.messageService.notificationVisibility.subscribe(visible => {
      this.visible = visible;
    }));
    this.event.push(this.messageService.remindClicked.subscribe(click => {
      this.getReminders();
    }));
  }
}
