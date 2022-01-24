import { Component, DoCheck, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { IDropDownOptionModel } from 'src/app/interfaces/dropdown/dropdown-option-model';
import { IJsonDropDownModel } from 'src/app/interfaces/dropdown/json-dropdown-model';
import { LangService } from 'src/app/services/lang.service';
import { Base } from '../base-classes/base';
import { IconService } from 'src/app/services/icon.service';
import { IDropDownOutputModel } from 'src/app/interfaces/dropdown/dropdown-output';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent extends Base implements OnChanges, DoCheck {

  @Input() input: IDropDownOutputModel = { field: '', type: '' };

  //language
  dropdown: IJsonDropDownModel = { icon: '' };
  //temporary
  showOptions: boolean = false;
  timeOut: any;

  constructor(
    langService: LangService, 
    iconService: IconService,
    router: Router, 
    ) {
    super(langService, iconService, router);
    this.config(this.component.dropdown);
  }

  ngDoCheck() {
    // this.showOptions = this.input.visible ?? false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dropdown = this.menu[this.input.field];
  }

  click(option: IDropDownOptionModel) {
    this.visible(false, 0);
    
    if (this.input.type === 'route') {
      this.router.navigateByUrl(option.url ?? 'not-found');
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
    super.langListener(this.component.dropdown);
    this.subscription.push(this.langService.langEvent.subscribe(result => {
      this.dropdown = this.menu[this.input.field];
    }));
  }
}
