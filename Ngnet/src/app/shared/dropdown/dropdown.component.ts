import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IDropDownOptionModel } from 'src/app/interfaces/dropdown/dropdown-option-model';
import { IJsonDropDownModel } from 'src/app/interfaces/dropdown/json-dropdown-model';
import { DropdownService } from 'src/app/services/dropdown.service';
import { LangService } from 'src/app/services/lang.service';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnChanges {

  @Input() input: { field: string, fieldUrl: string } = 
  {
    field: 'manager',
    fieldUrl: ''
  };
  //language
  selectedLang: string = this.langService.langState;
  jsonDropdown: any = this.langService.get(this.selectedLang).dropdown;
  dropdown: IJsonDropDownModel = {};
  //subscription
  subscription: Subscription[] = [];

  constructor(private route: Router, private langService: LangService, private dropdownService: DropdownService) {
    this.listener();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dropdown = this.jsonDropdown[this.input.field];
  }

  click(option: IDropDownOptionModel) {
    this.route.navigateByUrl(option.url ?? 'not-found');
  }

  private listener(): void {
    this.subscription.push(this.langService.langEvent.subscribe(result => {
      this.selectedLang = result.language;
      this.jsonDropdown = result.dropdown;
      this.dropdown = this.jsonDropdown[this.input.field];
    }));
  }
}
