import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ISimpleDropDownNames } from '../interfaces/simple-dropdown-names';
import { IHealthCareModel } from '../interfaces/health/health-care-model';
import { IErrorModel } from '../interfaces/response-error-model';
import { HealthService } from '../services/health.service';
import { LangService } from '../services/lang.service';
import { ICompanyDropDownNames } from '../interfaces/company-dropdown';
import { CompanyService } from '../services/company.service';

@Component({
  selector: 'app-health',
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.scss']
})
export class HealthComponent {

  serverErrors: IErrorModel[] = [];
  healthCares: IHealthCareModel[] = [];
  defaultHealthCares: IHealthCareModel = { isDeleted: false, company: { name: '' } };
  editingHealthCareId: string | undefined;
  editingCompanyId: number | undefined;
  langEvent: Subscription[] = [];
  selectedLang: string = this.langService.langState;
  menu: any = this.langService.get(this.selectedLang).healthcare;
  company: any = this.langService.get(this.selectedLang).company;
  names: ISimpleDropDownNames = {};
  companyNames: ICompanyDropDownNames = { vehicle: {}, health: {} };

  constructor(private healthService: HealthService, private langService: LangService, private route: Router, private companyService: CompanyService) { 
    this.loadNames();
    this.loadCompanyNames();
    this.langListener();
    this.self();
  }

  save(model: IHealthCareModel): void {
    
    if (this.editingHealthCareId) {
      model.id = this.editingHealthCareId;
      this.editingHealthCareId = undefined;
    }

    if (this.editingCompanyId) {
      model.company.id = this.editingCompanyId;
      this.editingCompanyId = undefined;
    }

    this.serverErrors = [] as IErrorModel[];
    
    this.healthService.save(model).subscribe({
      next: (res) => {
        if (res > 0) {
          this.self();
        }
        this.defaultHealthCares = { isDeleted: false, company: { name: '' } };
      },
      error: (err) => {
        (err?.error as []).forEach(e => {
          this.serverErrors.push(e);
        });
      }
    });
  }
  
  self(): void {
    this.healthService.self().subscribe({
      next: (res) => {
        console.log(res);
        this.healthCares = (res as IHealthCareModel[]).filter(x => x.isDeleted === false);
      },
      error: (err) => {
        (err?.error as []).forEach(e => {
          this.serverErrors.push(e);
        });
      }
    });;
  }
  
  remove(healthId: string | undefined): void {
    
    const model: IHealthCareModel = { isDeleted: true, id: healthId, company: { name: '' } };
    this.save(model);
  }
  
  edit(model: IHealthCareModel): void {
    this.defaultHealthCares = model;
    this.editingHealthCareId = model.id;
    this.editingCompanyId = model.company.id;
  }

  back(): void {
    this.route.navigateByUrl("manager");
  }
  
  private loadCompanyNames(): void {
    this.companyService.loadNames().subscribe(res => {
      this.companyNames = res;
    });
  }

  private loadNames(): void {
    this.healthService.loadNames().subscribe(res => {
      this.names = res;
    });
  }

  private langListener(): void {
    this.langEvent.push(this.langService.langEvent.subscribe(result => {
      this.selectedLang = result.language;
      this.menu = result.healthcare;
      this.company = result.company;
    }))
  }
}
