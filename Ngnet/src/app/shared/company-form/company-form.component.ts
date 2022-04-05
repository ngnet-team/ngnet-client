import { Component, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ICompanyDropDownNames } from 'src/app/interfaces/dropdown/company-dropdown';
import { ICompanyModel } from 'src/app/interfaces/company-model';
import { CompanyService } from 'src/app/services/components/company/company.service';
import { LangService } from 'src/app/services/common/lang/lang.service';
import { Base } from '../base-classes/base';
import { IconService } from '../../services/common/icon/icon.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FileService } from 'src/app/services/common/file/file.service';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss']
})
export class CompanyFormComponent extends Base implements OnChanges {

  @Input() company: ICompanyModel = {};
  @Output() dropdown: { field: string, name?: string } = { field: 'names' };
  //dropdowns
  companyNames: ICompanyDropDownNames = { vehicle: {}, health: {} };

  constructor(
    langService: LangService,
    iconService: IconService,
    authService: AuthService,
    router: Router,
    fileService: FileService,
    public companyService: CompanyService,
  ) {
    super(langService, iconService, authService, router, fileService);
    this.config(this.component.company);
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
}
