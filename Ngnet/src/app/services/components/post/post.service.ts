import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private serverUrl: string = environment.servers.social;

  constructor(private http: HttpClient, private route: Router, private authService: AuthService) { }

  getAll() {
    return this.http.get(this.serverUrl);
  }

  create(model: any) {
    return this.http.post(this.serverUrl, model);
  }

  update(model: any) {
    return this.http.patch(this.serverUrl, model);
  }

  delete(id: any) {
    return this.http.delete(this.serverUrl + id);
  }
}
