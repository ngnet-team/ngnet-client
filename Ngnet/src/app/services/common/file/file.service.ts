import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  url: string = environment.app.domain;

  constructor(private http: HttpClient) { }

  set(file: File) {
    if (!file) {
      return;
    }

    return new File([file], uuid(), {
      type: file?.type,
      lastModified: file?.lastModified,
    });
  }

  save(file: File) {
    const fd = new FormData();
    fd.append('image', file, file.name);
    return this.http.post('/assets/images/posts', fd);
  }
}
