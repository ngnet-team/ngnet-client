import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ISimpleDropDownNames } from '../interfaces/simple-dropdown-names';
import { IErrorModel } from '../interfaces/response-error-model';
import { IVehicleCareModel } from '../interfaces/vehicle/vehicle-care-model';
import { CompanyService } from '../services/company.service';
import { LangService } from '../services/lang.service';
import { VehicleService } from '../services/vehicle.service';
import { ICompanyDropDownNames } from '../interfaces/company-dropdown';
import { IDefaultVehicleCareModel } from '../interfaces/vehicle/default-vehicle-care-model';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent {

  serverErrors: IErrorModel[] = [];
  vehicleCares: IVehicleCareModel[] = [];
  defaultVehicleCare: IDefaultVehicleCareModel = { isDeleted: false, company: {} };
  editingVehicleCareId: string | undefined;
  editingCompanyId: number | undefined;
  langEvent: Subscription[] = [];
  selectedLang: string = this.langService.langState;
  menu: any = this.langService.get(this.selectedLang).vehiclecare;
  company: any = this.langService.get(this.selectedLang).company;
  names: ISimpleDropDownNames = {};
  companyNames: ICompanyDropDownNames = { vehicle: {}, health: {} };

  constructor(private vehicleService: VehicleService, private langService: LangService, private route: Router, private companyService: CompanyService) { 
    this.loadNames();
    this.loadCompanyNames();
    this.langListener();
    this.self();
   }

  save(model: IVehicleCareModel): void {

    //no company selected
    if (model.company?.name === undefined) {
      model.company = undefined;
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
    if (model.company?.email === '' || model.company?.phoneNumber === '') {
      model.company.email = undefined;
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

  private loadCompanyNames(): void {
    this.companyService.loadNames().subscribe(res => {
      this.companyNames = res;
    });
  }

  private loadNames(): void {
    this.vehicleService.loadNames().subscribe(res => {
      this.names = res;
    });
  }

  private langListener(): void {
    this.langEvent.push(this.langService.langEvent.subscribe(result => {
      this.selectedLang = result.language;
      this.menu = result.vehiclecare;
      this.company = result.company;
    }))
  }
}
