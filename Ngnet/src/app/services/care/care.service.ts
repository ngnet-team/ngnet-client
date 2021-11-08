import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICareModel } from '../../interfaces/care/care-model';

@Injectable({
  providedIn: 'root'
})
export class CareService {

  private serverUrl: string = environment.serverUrl;

  constructor(private http: HttpClient, private route: Router) { }

  loadNames(careUrl: string): Observable<any> {
    return this.http.get(this.serverUrl + careUrl + '/names');
  }

  save(model: ICareModel, careUrl: string): Observable<any> {
    return this.http.post(this.serverUrl + careUrl + '/save', model);
  }

  byId(model: ICareModel, careUrl: string): Observable<any> {
    return this.http.post(this.serverUrl + careUrl + '/byid', model);
  }

  byUserId(model: ICareModel, careUrl: string): Observable<any> {
    return this.http.post(this.serverUrl + careUrl + '/byuserid', model);
  }

  self(careUrl: string): Observable<any> {
    return this.http.get(this.serverUrl + careUrl + '/self');
  }

  delete(model: ICareModel, careUrl: string): Observable<any> {
    return this.http.post(this.serverUrl + careUrl + '/delete', model);
  }
}
