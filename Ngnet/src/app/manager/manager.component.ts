import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LangService } from '../services/lang.service';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent {

  managerUrl: string = '/manager/';
  langEvent: Subscription[] = [];
  selectedLang: string = this.langService.langState;
  menu: any = this.langService.get(this.selectedLang).manager;

  constructor(private langService: LangService, private route: Router) {
    this.langListener();
   }

  toVehicle(): void {
    this.route.navigateByUrl(this.managerUrl + "vehicle");
  }

  toHealth(): void {
    this.route.navigateByUrl(this.managerUrl + "health");
  }

  private langListener(): void {
    this.langEvent.push(this.langService.langEvent.subscribe(result => {
      this.selectedLang = result.language;
      this.menu = result.healthcare;
    }))
  }
}
