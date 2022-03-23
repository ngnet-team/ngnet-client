import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICareModel } from '../../../interfaces/care/care-model';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CareService {

  private serverUrl: string = environment.servers.care;
  private careBaseUrl: string = 'care';
  private request: ICareModel = { userId: this.authService.user?.userId, isDeleted: false, createdOn: new Date};

  constructor(private http: HttpClient, private route: Router, private authService: AuthService) { }

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
    return this.http.post(this.serverUrl + careUrl + '/self', this.request);
  }

  delete(model: ICareModel, careUrl: string): Observable<any> {
    return this.http.post(this.serverUrl + careUrl + '/delete', model);
  }

  remind(model: ICareModel): Observable<any> {
    return this.http.post(this.serverUrl + this.careBaseUrl + '/remindtoggle', model);
  }
}
