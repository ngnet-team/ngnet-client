import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IAdminUserResponseModel } from '../interfaces/admin/admin-user-response-model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private authUrl: string = environment.serverUrl + 'auth';

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<any> {
    return this.http.get(this.authUrl + '/all');
  }

  delete(user: IAdminUserResponseModel) {
    return this.http.post(this.authUrl + '/delete', user);
  }
}
