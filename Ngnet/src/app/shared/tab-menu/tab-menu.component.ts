import { Component, DoCheck, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ITabModel } from 'src/app/interfaces/tab-model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FileService } from 'src/app/services/common/file/file.service';
import { IconService } from 'src/app/services/common/icon/icon.service';
import { LangService } from 'src/app/services/common/lang/lang.service';
import { TabService } from 'src/app/services/common/tab/tab.service';
import { environment } from 'src/environments/environment';
import { Base } from '../base-classes/base';

@Component({
  selector: 'app-tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.scss']
})
export class TabMenuComponent extends Base implements DoCheck {

  model: ITabModel = {};

  @Input() visible: boolean = false;
  @Input() isLogged: boolean = this.authService.isLogged;

  @Output() managerDropdown: { field: string, type: string } = { field: 'manager', type: 'route' };
  @Output() languageDropdown: { field: string, type: string, value: string } = { field: 'language', type: 'state', value: '' };
  //language
  event: Subscription[] = [];
  selectedLang: string = this.langService.getLocalStorage() ?? environment.lang.default;
  menu: any = this.langService.get(this.selectedLang).nav;

  dropdown: any = this.langService.get(this.selectedLang).dropdown;

  constructor(
    langService: LangService, 
    iconService: IconService, 
    authService: AuthService,
    router: Router, 
    fileService: FileService,
    private tabService: TabService
    ) {
    super(langService, iconService, authService, router, fileService);
    this.config(this.component.tabMenu);
    this.subscriptionListener();
  }

  ngDoCheck(): void {
    //change language only the value is different and existing one
    if (this.languageDropdown.value !== this.selectedLang && this.languageDropdown.value) {
      this.changeLang(this.languageDropdown.value);
    }
  }

  click(tab: ITabModel): void {
    if (tab.url?.includes('/')) {
      this.router.navigateByUrl(tab.url ?? 'not-fount');
    } else {
      this.model = tab;
      this.tabService.event.emit(this.model);
    }
    
    this.visible = false;
  }

  changeLang(language: string): void {
    // this.selectedLang = this.selectedLang === environment.lang.bg ? environment.lang.en : environment.lang.bg;
    this.selectedLang = language;
    this.langService.setLocalStorage(this.selectedLang);
    this.menu = this.langService.get(this.selectedLang).nav;
  }

  override langListener(): void {
    super.langListener(this.component.nav);
    this.subscription.push(this.langService.langEvent.subscribe(result => {
      this.dropdown = result.dropdown;
    }));
  }

  private subscriptionListener(): void {
    this.event.push(this.authService.logginEvent.subscribe(isLogged => {
      this.isLogged = isLogged;
    }));
  }
}
