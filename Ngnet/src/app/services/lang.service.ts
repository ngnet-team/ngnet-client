import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as bg from "../../assets/translations/bg.json";
import * as en from "../../assets/translations/en.json";
import { ILangModel } from '../interfaces/lang-model';

@Injectable({
  providedIn: 'root'
})
export class LangService {

  langEvent: EventEmitter<any> = new EventEmitter();
  langState: string = this.getLocalStorage() ?? environment.lang.default;

  constructor() {
    if (!this.getLocalStorage()) {
      this.setLocalStorage(environment.lang.default);
    }
  }

  get(language: string): ILangModel {
    this.langState = language;
    const result = language === environment.lang.en ? en : bg;
    this.langEvent.emit(result);

    return result;
  }

  setLocalStorage(language: string): void {
    localStorage.setItem(environment.lang.title, language);
  }

  getLocalStorage(): string | null {
    return localStorage.getItem(environment.lang.title);
  }
}
