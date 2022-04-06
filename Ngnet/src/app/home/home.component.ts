import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { FileService } from '../services/common/file/file.service';
import { IconService } from '../services/common/icon/icon.service';
import { LangService } from '../services/common/lang/lang.service';
import { Base } from '../shared/base-classes/base';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends Base {

  isLogged: boolean = this.authService.isLogged;
  
  constructor(
    langService: LangService, 
    iconService: IconService,
    authService: AuthService,
    route: Router,
    fileService: FileService,
    ) {
    super(langService, iconService, authService, route, fileService);
    this.config(this.component.home);
  }
}
