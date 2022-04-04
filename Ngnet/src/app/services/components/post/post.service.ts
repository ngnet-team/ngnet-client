import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private postsApiUrl: string = environment.servers.social + 'post' + '/';
  private commentsApiUrl: string = environment.servers.social + 'comment' + '/';

  constructor(private http: HttpClient, private route: Router, private authService: AuthService) { }

  getAll(): Observable<any> {
    return this.http.get(this.postsApiUrl);
  }

  create(model: any): Observable<any> {
    return this.http.post(this.postsApiUrl, model);
  }

  update(model: any): Observable<any> {
    return this.http.patch(this.postsApiUrl, model);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(this.postsApiUrl + id);
  }

  react(model: any): Observable<any> {
    return this.http.post(this.postsApiUrl + 'reaction/', model);
  }

  addComment(model: any): Observable<any> {
    return this.http.post(this.commentsApiUrl, model);
  }

  removeComment(model: any): Observable<any> {
    return this.http.delete(this.commentsApiUrl + model.commentId);
  }
}
