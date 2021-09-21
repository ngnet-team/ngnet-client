import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { IErrorModel } from '../interfaces/response-error-model';
import { IVehicleCareModel } from '../interfaces/vehicle/vehicle-care-model';
import { IVehicleNames } from '../interfaces/vehicle/vehicle-names';
import { LangService } from '../services/lang.service';
import { VehicleService } from '../services/vehicle.service';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent {

  serverErrors: IErrorModel[] = [];
  vehicleCares: IVehicleCareModel[] = [];
  defaultVehicleCares: IVehicleCareModel = { isDeleted: false };
  editingId: string | undefined;
  langEvent: Subscription[] = [];
  selectedLang: string = this.langService.langState;
  menu: any = this.langService.get(this.selectedLang).vehiclecare;
  names: IVehicleNames = {};

  constructor(private vehicleService: VehicleService, private langService: LangService) { 
    this.loadNames();
    this.langListener();
    this.self();
   }

  loadNames(): void {
    this.vehicleService.loadNames().subscribe(res => {
      this.names = res;
    });
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
        this.defaultVehicleCares = { isDeleted: false };
      },
      error: (err) => {
        (err?.error as []).forEach(e => {
          this.serverErrors.push(e);
        });
      }
    });
  }
  
  self(): void {
    this.vehicleService.self().subscribe(res => {
      this.vehicleCares = (res as IVehicleCareModel[]).filter(x => x.isDeleted === false);
    });;
  }
  
  remove(vehicleId: string | undefined): void {
    
    const model: IVehicleCareModel = { isDeleted: true, id: vehicleId };
    this.save(model);
  }
  
  edit(model: IVehicleCareModel): void {
    this.defaultVehicleCares = model;
    this.editingId = model.id;
  }
  
  private langListener(): void {
    this.langEvent.push(this.langService.langEvent.subscribe(result => {
      this.selectedLang = result.language;
      this.menu = result.vehiclecare;
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
