import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IHealthCareModel } from '../interfaces/health/health-care-model';

@Injectable({
  providedIn: 'root'
})
export class HealthService {
  
  private healthUrl: string = environment.serverUrl + 'healthcare';

  constructor(private http: HttpClient, private route: Router) { }

  loadNames(): Observable<any> {
    return this.http.get(this.healthUrl + '/names');
  }

  save(model: IHealthCareModel): Observable<any> {
    return this.http.post(this.healthUrl + '/save', model);
  }

  byId(model: IHealthCareModel): Observable<any> {
    return this.http.post(this.healthUrl + '/byid', model);
  }

  byUserId(model: IHealthCareModel): Observable<any> {
    return this.http.post(this.healthUrl + '/byuserid', model);
  }

  self(): Observable<any> {
    return this.http.get(this.healthUrl + '/self');
  }

  delete(model: IHealthCareModel): Observable<any> {
    return this.http.post(this.healthUrl + '/delete', model);
  }
}
