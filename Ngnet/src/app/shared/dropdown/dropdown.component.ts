import { Component, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
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

  @Input() input: { field: string, type: string, value?: string } = { field: '', type: '' };

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
    if (this.input.type === 'route') {
      this.route.navigateByUrl(option.url ?? 'not-found');
    } else if (this.input.type === 'state') {
      this.input.value = option.url;
    }
  }

  private listener(): void {
    this.subscription.push(this.langService.langEvent.subscribe(result => {
      this.selectedLang = result.language;
      this.jsonDropdown = result.dropdown;
      this.dropdown = this.jsonDropdown[this.input.field];
    }));
  }
}
