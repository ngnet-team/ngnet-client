import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { IDropDownOptionModel } from 'src/app/interfaces/dropdown/dropdown-option-model';
import { IJsonDropDownModel } from 'src/app/interfaces/dropdown/json-dropdown-model';
import { LangService } from 'src/app/services/lang.service';
import { LangBase } from '../base-classes/lang-base';
import { IconService } from 'src/app/services/icon.service';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent extends LangBase implements OnChanges {

  @Input() input: { field: string, type: string, value?: string } = { field: '', type: '' };

  //language
  jsonDropdown: any = this.langService.get(this.selectedLang).dropdown;
  dropdown: IJsonDropDownModel = {};
  icons: any = this.iconService.get('dropdown');
  //temporary
  showOptions: boolean = false;
  timeOut: any;

  constructor(private route: Router, langService: LangService, private iconService: IconService) {
    super(langService);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dropdown = this.jsonDropdown[this.input.field];
  }

  click(option: IDropDownOptionModel) {
    this.visible(false, 0);
    
    if (this.input.type === 'route') {
      this.route.navigateByUrl(option.url ?? 'not-found');
    } else if (this.input.type === 'state') {
      this.input.value = option.url;
    }
  }

  visible(show: boolean, time: number = 100) {
    if (show === false) {
      this.timeOut = setTimeout(() => {
        this.showOptions = show;
      }, time);
    } else {
      clearTimeout(this.timeOut);
      this.showOptions = show;
    }
  }

  override langListener(): void {
    this.subscription.push(this.langService.langEvent.subscribe(result => {
      this.jsonDropdown = result.dropdown;
      this.dropdown = this.jsonDropdown[this.input.field];
    }));
  }
}
