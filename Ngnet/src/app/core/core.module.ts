import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav/nav.component';
import { AppRoutingModule } from '../app-routing.module';
import { UserRoutingModule } from '../auth/auth-routing.module';
import { AuthModule } from '../auth/auth.module';
import { SharedModule } from '../shared/shared.module';
import { NotificationComponent } from './notification/notification.component';



@NgModule({
  declarations: [
    NavComponent,
    NotificationComponent,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  imports: [
    AuthModule,
    CommonModule,
    AppRoutingModule,
    UserRoutingModule,
    SharedModule,
  ],
  exports: [
    NavComponent,
    NotificationComponent
  ]
})
export class CoreModule { }
