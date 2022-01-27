import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { IconService } from '../services/icon.service';
import { LangService } from '../services/lang.service';
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
    ) {
    super(langService, iconService, authService, route);
    this.config(this.component.home);
  }
}
