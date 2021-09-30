import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { IDropDownModel } from 'src/app/interfaces/dropdown-model';
import { DropdownService } from 'src/app/services/dropdown.service';
import { LangService } from 'src/app/services/lang.service';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent {

  @Input() dropdown: IDropDownModel = {};
  //language
  selectedLang: string = this.langService.langState;
  //subscription
  subscription: Subscription[] = [];
  
  constructor(private dropdownService: DropdownService, private langService: LangService) { 
    this.listener();
    this.get();
  }

  get() {
    this.dropdown = this.dropdownService.managerMenu(this.selectedLang);
    console.log(this.dropdown);
  }

  private listener(): void {
    this.subscription.push(this.langService.langEvent.subscribe(result => {
      this.selectedLang = result.language;
      this.dropdown = this.dropdownService.managerMenu(this.selectedLang);
    }));
  }
}
