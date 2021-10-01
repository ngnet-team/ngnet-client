import { Component, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { IDropDownModel } from 'src/app/interfaces/dropdown/dropdown-model';
import { DropdownService } from 'src/app/services/dropdown.service';
import { LangService } from 'src/app/services/lang.service';

@Component({
  selector: 'app-s-dropdown',
  templateUrl: './s-dropdown.component.html',
  styleUrls: ['./s-dropdown.component.scss']
})
export class SDropdownComponent implements OnChanges {

  @Input() input: { field?: string, name?: string } = {};
  //language
  selectedLang: string = this.langService.langState;
  //subscription
  subscription: Subscription[] = [];
  //model
  dropdown: IDropDownModel = {};
  
  constructor(private langService: LangService, private dropdownService: DropdownService) {
    this.listener();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.get();
  }

  private get() {
    this.dropdownService.get(this.input.field ?? '').subscribe(x => {
      if (x === undefined) {
        return;
      }

      this.dropdown = x.vehicle;
    });
  }

  private listener(): void {
    this.subscription.push(this.langService.langEvent.subscribe(result => {
      this.selectedLang = result.language;
    }));
  }

}
