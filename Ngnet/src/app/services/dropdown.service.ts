import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IDropDownModel } from '../interfaces/dropdown-model';
import { LangService } from './lang.service';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  model: IDropDownModel = {};
  //lang
  selectedLang: string = this.langService.langState;
  menu: any = this.langService.get(this.selectedLang).dropdown;

  constructor(private http: HttpClient, private route: Router, private langService: LangService) { }

  managerMenu(lang: string): IDropDownModel {
    const dropdown: IDropDownModel = { title: this.menu.manager };
    if (lang === 'bg') {
      dropdown.bg = [ this.menu.vehiclecare, this.menu.healthcare ];
    } else if (lang === 'en') {
      dropdown.en = [ this.menu.vehiclecare, this.menu.healthcare ];
    }
    
    return dropdown;
  }
}
