import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private postsApiUrl: string = environment.servers.social + 'post' + '/';

  constructor(private http: HttpClient, private route: Router, private authService: AuthService) { }

  getAll() {
    return this.http.get(this.postsApiUrl);
  }

  create(model: any) {
    return this.http.post(this.postsApiUrl, model);
  }

  update(id: any, model: any) {
    return this.http.patch(this.postsApiUrl + id, model);
  }

  delete(id: any) {
    return this.http.delete(this.postsApiUrl + id);
  }
}
