import { Component, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ICompanyDropDownNames } from 'src/app/interfaces/dropdown/company-dropdown';
import { ICompanyModel } from 'src/app/interfaces/company-model';
import { CompanyService } from 'src/app/services/company.service';
import { LangService } from 'src/app/services/lang.service';
import { Base } from '../base-classes/base';
import { IconService } from '../../services/icon.service';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss']
})
export class CompanyFormComponent extends Base implements OnChanges {

  @Input() company: ICompanyModel = {};
  @Output() dropdown: { field: string, name?: string } = { field: 'names' };
  //language
  menu: any = this.langService.get(this.selectedLang).company;
  //dropdowns
  companyNames: ICompanyDropDownNames = { vehicle: {}, health: {} };
  //icons
  icons: any = this.iconService.get(this.component.company);

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
    super.langListener(this.component.company);
  }
}
