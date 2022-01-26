import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICompanyModel } from '../../../interfaces/company-model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private companyUrl: string = environment.serverUrl + 'company';
  model: ICompanyModel = {};

  constructor(private http: HttpClient, private route: Router) { }

  loadNames(): Observable<any> {
    return this.http.get(this.companyUrl + '/names');
  }
}
