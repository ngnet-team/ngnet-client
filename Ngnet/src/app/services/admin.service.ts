import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private authUrl: string = environment.serverUrl + 'auth';

  constructor(private http: HttpClient, private route: Router) { }

  getAllUsers(): Observable<any> {
    return this.http.get(this.authUrl + '/all');
  }
}
