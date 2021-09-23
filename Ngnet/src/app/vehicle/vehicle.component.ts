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

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent {

  serverErrors: IErrorModel[] = [];
  vehicleCares: IVehicleCareModel[] = [];
  defaultVehicleCares: IVehicleCareModel = { isDeleted: false, company: { name: '' } };
  editingId: string | undefined;
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
    
    if (this.editingId) {
      model.id = this.editingId;
      this.editingId = undefined;
    }

    this.serverErrors = [] as IErrorModel[];
    
    this.vehicleService.save(model).subscribe({
      next: (res) => {
        if (res > 0) {
          this.self();
        }
        this.defaultVehicleCares = { isDeleted: false, company: { name: '' } };
      },
      error: (err) => {
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
        (err?.error as []).forEach(e => {
          this.serverErrors.push(e);
        });
      }
    });;
  }
  
  remove(vehicleId: string | undefined): void {
    
    const model: IVehicleCareModel = { isDeleted: true, id: vehicleId, company: { name: '' } };
    this.save(model);
  }
  
  edit(model: IVehicleCareModel): void {
    this.defaultVehicleCares = model;
    this.editingId = model.id;
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

    // byId(model: IVehicleCareModel): void {
    //   this.vehicleService.byId(model).subscribe(res => {
    //     console.log(res);
    //   });;
    // }
  
    // byUserId(model: IVehicleCareModel): void {
    //   this.vehicleService.byUserId(model).subscribe(res => {
    //     console.log(res);
    //   });;
    // }
}
