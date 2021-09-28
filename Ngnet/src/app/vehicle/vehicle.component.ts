import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ISimpleDropDownNames } from '../interfaces/simple-dropdown-names';
import { IErrorModel } from '../interfaces/response-error-model';
import { IVehicleCareModel } from '../interfaces/vehicle/vehicle-care-model';
import { LangService } from '../services/lang.service';
import { VehicleService } from '../services/vehicle.service';
import { IDefaultVehicleCareModel } from '../interfaces/vehicle/default-vehicle-care-model';
import { IPageModel } from '../interfaces/page-model';
import { PagerService } from '../services/pager.service';
import { ICompanyModel } from '../interfaces/company-model';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent {

  serverErrors: IErrorModel[] = [];
  //models
  vehicleCares: IVehicleCareModel[] = [];
  defaultVehicleCare: IDefaultVehicleCareModel = { isDeleted: false, company: {} };
  //temporary
  editingVehicleCareId: string | undefined;
  editingCompanyId: number | undefined;
  saveClicked: boolean = this.defaultVehicleCare.company == {};
  //language
  selectedLang: string = this.langService.langState;
  menu: any = this.langService.get(this.selectedLang).vehiclecare;
  validations: any = this.langService.get(this.selectedLang).validations;
  //subscription
  subscription: Subscription[] = [];
  //dropdowns
  names: ISimpleDropDownNames = {};
  //pager
  @Output() pager: IPageModel = this.pagerService.model;
  pagedVehicleCares: IVehicleCareModel[] = [];
  //company
  @Output() company: ICompanyModel = this.defaultVehicleCare.company;

  constructor(private vehicleService: VehicleService,
    private langService: LangService,
    private route: Router,
    private pagerService: PagerService) {
    this.loadNames();
    this.listener();
    this.self();
  }

  save(model: IVehicleCareModel): void {
    //company selected
    if (this.defaultVehicleCare.company?.name === undefined) {
      model.company = undefined;
    } else {
      model.company = this.defaultVehicleCare.company;
    }

    //changing existing vehicle
    if (this.editingVehicleCareId) {
      model.id = this.editingVehicleCareId;
      this.editingVehicleCareId = undefined;
    }

    //changing existing company
    if (this.editingCompanyId) {
      (model as IDefaultVehicleCareModel).company.id = this.editingCompanyId;
      this.editingCompanyId = undefined;
    }

    //avoid empty strings for validated properties in the server 
    if (model.company?.email === '') {
      model.company.email = undefined;
    } 
    if (model.company?.phoneNumber === '') {
      model.company.phoneNumber = undefined;
    }

    this.serverErrors = [] as IErrorModel[];

    this.vehicleService.save(model).subscribe({
      next: (res) => {
        if (res > 0) {
          this.self();
        }
        this.defaultVehicleCare = { isDeleted: false, company: {} };
      },
      error: (err) => {
        console.log(err.error.errors);
        (err?.error as []).forEach(e => {
          this.serverErrors.push(e);
        });
      }
    });
  }

  self(): void {
    this.vehicleService.self().subscribe({
      next: (res) => {
        this.vehicleCares = (res as IVehicleCareModel[]).filter(x => x.isDeleted === false);
        //pager view
        this.pagerService.model.totalPages = this.pagerService.setPageNumbers(this.vehicleCares.length);
        //results view
        this.pagination();
      },
      error: (err) => {
        console.log(err.error.errors);
        (err?.error as []).forEach(e => {
          this.serverErrors.push(e);
        });
      }
    });
  }

  remove(model: IVehicleCareModel): void {

    model.isDeleted = true;
    this.save(model);
  }

  edit(model: IVehicleCareModel): void {
    if (model.company === null) {
      model.company = { id: undefined };
    }
    this.defaultVehicleCare = (model as IDefaultVehicleCareModel);
    this.editingVehicleCareId = model.id;
    this.editingCompanyId = model.company?.id;
  }

  back(): void {
    this.route.navigateByUrl("manager");
  }

  private loadNames(): void {
    this.vehicleService.loadNames().subscribe(res => {
      this.names = res;
    });
  }

  private pagination() {
    const { skip, take } = this.pagerService.skipTake(this.vehicleCares.length);
    this.pagedVehicleCares = this.vehicleCares.slice(skip, take);
  }

  private listener(): void {
    this.subscription.push(this.langService.langEvent.subscribe(result => {
      this.selectedLang = result.language;
      this.menu = result.vehiclecare;
      this.company = result.company;
      this.validations = result.validations;
    }))

    this.subscription.push(this.pagerService.pageSelect.subscribe(pageNumber => {
      this.pager.pageNumber = pageNumber;
      this.pagination();
    }))
  }
}
