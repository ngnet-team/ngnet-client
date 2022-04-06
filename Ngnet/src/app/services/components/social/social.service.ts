import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SocialService {

  private postsApiUrl: string = environment.servers.social + 'post' + '/';
  private commentsApiUrl: string = environment.servers.social + 'comment' + '/';

  constructor(private http: HttpClient, private route: Router, private authService: AuthService) { }

  getPosts(): Observable<any> {
    return this.http.get(this.postsApiUrl);
  }

  addPost(model: any): Observable<any> {
    return this.http.post(this.postsApiUrl, model);
  }

  updatePost(model: any): Observable<any> {
    return this.http.patch(this.postsApiUrl, model);
  }

  removePost(id: any): Observable<any> {
    return this.http.delete(this.postsApiUrl + id);
  }

  reactPost(model: any): Observable<any> {
    return this.http.post(this.postsApiUrl + 'reaction/', model);
  }

  addComment(model: any): Observable<any> {
    return this.http.post(this.commentsApiUrl, model);
  }

  updateComment(model: any): Observable<any> {
    return this.http.patch(this.commentsApiUrl, model);
  }

  removeComment(model: any): Observable<any> {
    return this.http.delete(this.commentsApiUrl + model.commentId);
  }

  reactComment(model: any): Observable<any> {
    return this.http.post(this.commentsApiUrl + 'reaction/', model);
  }
}
