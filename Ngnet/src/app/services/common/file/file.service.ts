import { Injectable } from '@angular/core';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() { }

  setFile(file: File) {
    if (!file) {
      return;
    }

    return new File([file], uuid(), {
      type: file?.type,
      lastModified: file?.lastModified,
    });
  }
}
