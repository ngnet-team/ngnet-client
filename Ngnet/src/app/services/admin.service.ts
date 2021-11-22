import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IAdminUserModel } from '../interfaces/admin/admin-user-model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private adminUrl: string = environment.serverUrl + 'admin';

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<any> {
    return this.http.get(this.adminUrl + '/getAllUsers');
  }

  update(user: IAdminUserModel): Observable<any> {
    return this.http.post(this.adminUrl + '/update', user);
  }
}
