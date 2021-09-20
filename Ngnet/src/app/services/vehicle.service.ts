import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IVehicleCareModel } from '../interfaces/vehicle/vehicle-care-model';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private vehicleUrl: string = environment.serverUrl + 'vehiclecare';

  constructor(private http: HttpClient, private route: Router) { }

  loadNames(): Observable<any> {
    return this.http.get(this.vehicleUrl + '/names');
  }

  save(model: IVehicleCareModel): Observable<any> {
    return this.http.post(this.vehicleUrl + '/save', model);
  }

  byId(model: IVehicleCareModel): Observable<any> {
    return this.http.post(this.vehicleUrl + '/byid', model);
  }

  byUserId(model: IVehicleCareModel): Observable<any> {
    return this.http.post(this.vehicleUrl + '/byuserid', model);
  }

  self(): Observable<any> {
    return this.http.get(this.vehicleUrl + '/self');
  }

  delete(model: IVehicleCareModel): Observable<any> {
    return this.http.post(this.vehicleUrl + '/delete', model);
  }
}
