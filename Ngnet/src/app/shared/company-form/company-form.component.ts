import { Component, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ICompanyDropDownNames } from 'src/app/interfaces/dropdown/company-dropdown';
import { ICompanyModel } from 'src/app/interfaces/company-model';
import { CompanyService } from 'src/app/services/company.service';
import { LangService } from 'src/app/services/lang.service';
import { LangBase } from '../base-classes/lang-base';
import { IconService } from '../../services/icon.service';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss']
})
export class CompanyFormComponent extends LangBase implements OnChanges {

  @Input() company: ICompanyModel = {};
  @Output() dropdown: { field: string, name?: string } = { field: 'names' };
  //language
  menu: any = this.langService.get(this.selectedLang).company;
  validations: any = this.langService.get(this.selectedLang).validations;
  //dropdowns
  companyNames: ICompanyDropDownNames = { vehicle: {}, health: {} };
  //icons
  icons: any = this.iconService.get('companyForm');

  constructor(
    public companyService: CompanyService,
    langService: LangService,
    private iconService: IconService
  ) {
    super(langService);
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

  override langListener(): void {
    this.subscription.push(this.langService.langEvent.subscribe(result => {
      this.selectedLang = result.language;
      this.menu = result.company;
      this.validations = result.validations;
    }));
  }
}
