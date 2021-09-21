import { Component } from '@angular/core';
import { IVehicleCareModel } from '../interfaces/vehicle/vehicle-care-model';
import { IVehicleNames } from '../interfaces/vehicle/vehicle-names';
import { VehicleService } from '../services/vehicle.service';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.sass']
})
export class VehicleComponent {

  names: IVehicleNames = {};
  vehicleCare: IVehicleCareModel = { isDeleted: false };

  constructor(private vehicleService: VehicleService) { this.loadNames(); }

  loadNames(): void {
    this.vehicleService.loadNames().subscribe(res => {
      this.names = res;
    });
  }

  save(model: IVehicleCareModel): void {
    this.vehicleService.save(model).subscribe(res => {
      console.log(res);
    });;
  }

  byId(model: IVehicleCareModel): void {
    this.vehicleService.byId(model).subscribe(res => {
      console.log(res);
    });;
  }

  byUserId(model: IVehicleCareModel): void {
    this.vehicleService.byUserId(model).subscribe(res => {
      console.log(res);
    });;
  }

  self(): void {
    this.vehicleService.self().subscribe(res => {
      console.log(res);
    });;
  }

  delete(model: IVehicleCareModel): void {
    this.vehicleService.delete(model).subscribe(res => {
      console.log(res);
    });;
  }
}
