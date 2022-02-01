import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IAdminUserModel } from 'src/app/interfaces/modules/dashboard/admin-user-model';
import { IRoleModel } from 'src/app/interfaces/modules/dashboard/role-model';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends AuthService {

  private serverUrl: string = environment.serverUrl;

  constructor(protected http: HttpClient, protected router: Router) {
    super(http, router)
  }

  // ============================================================================================
  // ========================================== Admins ==========================================
  // ============================================================================================

  //Auth board
  getUsers(): Observable<any> {
    return this.http.get(this.authUrl + this.roleUrl + '/getUsers');
  }

  changeRole(user: IAdminUserModel): Observable<any> {
    return this.http.post(this.authUrl + this.roleUrl + '/changeRole', user);
  }

  getRoles(): Observable<IRoleModel[]> {
    return this.http.get(this.authUrl + this.roleUrl + '/getRoles') as Observable<IRoleModel[]>;
  }

  //Entity board
  getEntries(): Observable<any> {
    return this.http.get(this.authUrl + this.roleUrl + '/getEntries');
  }

  // ============================================================================================
  // ========================================== Owners ==========================================
  // ============================================================================================

  //Auth board
  setMaxRoles(maxRoles: IRoleModel): Observable<any> {
    return this.http.post(this.authUrl + this.roleUrl + '/setMaxRoles', maxRoles);
  }
}