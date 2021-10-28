import { Component, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IDropDownModel } from '../interfaces/dropdown/dropdown-model';
import { IHealthCareModel } from '../interfaces/health/health-care-model';
import { IErrorModel } from '../interfaces/response-error-model';
import { HealthService } from '../services/care/health.service';
import { LangService } from '../services/lang.service';
import { ICompanyDropDownNames } from '../interfaces/dropdown/company-dropdown';
import { CompanyService } from '../services/company.service';
import { IDefaultHealthCareModel } from '../interfaces/health/default-health-care-model';
import { IPageModel } from '../interfaces/page-model';
import { ICompanyModel } from '../interfaces/company-model';
import { PagerService } from '../services/pager.service';
import { environment } from 'src/environments/environment';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-health',
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.scss']
})
export class HealthComponent {

  serverErrors: IErrorModel = {};
  errors: string[] | undefined;
  //models
  healthCares: IHealthCareModel[] = [];
  defaultHealthCare: IDefaultHealthCareModel = { isDeleted: false, company: {} };
  //temporary
  editingHealthCareId: string | undefined;
  editingCompanyId: number | undefined;
  saveClicked: boolean = this.defaultHealthCare.company == {};
  //language
  selectedLang: string = this.langService.langState;
  menu: any = this.langService.get(this.selectedLang).healthcare;
  validations: any = this.langService.get(this.selectedLang).validations;
  //subscription
  subscription: Subscription[] = [];
  //dropdowns
  names: IDropDownModel = {};
  //pager
  @Output() pager: IPageModel = this.pagerService.model;
  pagedHealthCares: IHealthCareModel[] = [];
  //company
  @Output() company: ICompanyModel = this.defaultHealthCare.company;

  constructor(private healthService: HealthService,
    private langService: LangService,
    private route: Router,
    private pagerService: PagerService, 
    private messageService: MessageService) {
    this.loadNames();
    this.listener();
    this.self();
  }

  save(model: IHealthCareModel): void {
    //company selected
    if (this.defaultHealthCare.company?.name === undefined) {
      model.company = undefined;
    } else {
      model.company = this.defaultHealthCare.company;
    }

    //changing existing vehicle
    if (this.editingHealthCareId) {
      model.id = this.editingHealthCareId;
      this.editingHealthCareId = undefined;
    }

    //changing existing company
    if (this.editingCompanyId) {
      (model as IDefaultHealthCareModel).company.id = this.editingCompanyId;
      this.editingCompanyId = undefined;
    }

    //avoid empty strings for validated properties in the server 
    if (model.company?.email === '') {
      model.company.email = undefined;
    } 
    if (model.company?.phoneNumber === '') {
      model.company.phoneNumber = undefined;
    }

    this.serverErrors = {} as IErrorModel;

    this.healthService.save(model).subscribe({
      next: (res) => {
        if (res) {
          const msg = this.messageService.getMsg(res, this.selectedLang);
          this.messageService.event.emit(msg);
          this.self();
        }
        this.defaultHealthCare = { isDeleted: false, company: {} };
      },
      error: (err) => {
        if (err?.error) {
          this.serverErrors = err?.error;
          this.setServerError();
        };
      }
    });
  }

  self(): void {
    this.healthService.self().subscribe({
      next: (res) => {
        this.errors = [];
        this.healthCares = (res as IHealthCareModel[]).filter(x => x.isDeleted === false);
        //pager view
        this.pagerService.model.totalPages = this.pagerService.setPageNumbers(this.healthCares.length);
        //results view
        this.pagination();
      },
      error: (err) => {
        if (err?.error) {
          this.serverErrors = err?.error;
          this.setServerError();
        };
      }
    });
  }

  remove(model: IHealthCareModel): void {

    model.isDeleted = true;
    this.save(model);
  }

  edit(model: IHealthCareModel): void {
    if (model.company === null) {
      model.company = { id: undefined };
    }
    this.defaultHealthCare = (model as IDefaultHealthCareModel);
    this.editingHealthCareId = model.id;
    this.editingCompanyId = model.company?.id;
  }

  back(): void {
    this.route.navigateByUrl("manager");
  }

  private setServerError() {
    this.errors = this.selectedLang === environment.lang.bg ? this.serverErrors.bg : this.serverErrors.en;
  }

  private loadNames(): void {
    this.healthService.loadNames().subscribe(res => {
      this.names = res;
    });
  }

  private pagination() {
    const { skip, take } = this.pagerService.skipTake(this.healthCares.length);
    this.pagedHealthCares = this.healthCares.slice(skip, take);
  }

  private listener(): void {
    this.subscription.push(this.langService.langEvent.subscribe(result => {
      this.selectedLang = result.language;
      this.menu = result.healthcare;
      this.company = result.company;
      this.validations = result.validations;
    }))

    this.subscription.push(this.pagerService.pageSelect.subscribe(pageNumber => {
      this.pager.pageNumber = pageNumber;
      this.pagination();
    }))
  }
}
