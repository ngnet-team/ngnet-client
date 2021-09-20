import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav/nav.component';
import { AppRoutingModule } from '../app-routing.module';
import { UserRoutingModule } from '../auth/auth-routing.module';
import { AuthModule } from '../auth/auth.module';



@NgModule({
  declarations: [
    NavComponent
  ],
  imports: [
    AuthModule,
    CommonModule,
    AppRoutingModule,
    UserRoutingModule,
  ],
  exports: [
    NavComponent
  ]
})
export class CoreModule { }
