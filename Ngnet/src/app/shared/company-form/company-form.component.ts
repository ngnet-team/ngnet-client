import { Component, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { ICompanyDropDownNames } from 'src/app/interfaces/dropdown/company-dropdown';
import { ICompanyModel } from 'src/app/interfaces/company-model';
import { CompanyService } from 'src/app/services/company.service';
import { LangService } from 'src/app/services/lang.service';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss']
})
export class CompanyFormComponent implements OnChanges {

  @Input() company: ICompanyModel = {};
  @Output() dropdown: { field: string, name?: string } = { field: 'names' };
  //language
  selectedLang: string = this.langService.langState;
  menu: any = this.langService.get(this.selectedLang).company;
  validations: any = this.langService.get(this.selectedLang).validations;
  //dropdowns
  companyNames: ICompanyDropDownNames = { vehicle: {}, health: {} };
  //subscription
  subscription: Subscription[] = [];

  constructor(public companyService: CompanyService, private langService: LangService) {
    this.listener();
    this.loadNames();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dropdown.name = this.company.name;
  }

  private loadNames(): void {
    this.companyService.loadNames().subscribe(res => {
      this.companyNames = res;
    });
  }

  private listener(): void {
    this.subscription.push(this.langService.langEvent.subscribe(result => {
      this.selectedLang = result.language;
      this.menu = result.company;
      this.validations = result.validations;
    }));
  }
}
