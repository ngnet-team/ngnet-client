import { EventEmitter, Injectable } from '@angular/core';
import * as bg from "../../assets/translations/bg.json";
import * as en from "../../assets/translations/en.json";

@Injectable({
  providedIn: 'root'
})
export class LangService {

  langEvent: EventEmitter<any> = new EventEmitter();

  get(language: string) {
    const result = language === "en" ? en : bg;
    this.langEvent.emit(result);

    return result;
  }
}
