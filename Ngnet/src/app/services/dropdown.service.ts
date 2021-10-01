import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  dropdownUrl: string = environment.serverUrl + 'company/';

  constructor(private http: HttpClient) { }

  get(field: string): Observable<any> {

    if (field === '') {
      return EMPTY;
    }
    return this.http.get(this.dropdownUrl + field);
  }
}
