import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { AuthGuardService } from './services/guard/auth-guard.service';
import { ErrorInterceptorService } from './services/interceptors/error-interceptor.service';
import { HttpInterceptorService } from './services/interceptors/http-interceptor.service';
import { SharedModule } from './shared/shared.module';
import { HomeComponent } from './home/home.component';
import { ProfileResolverService } from './services/profile-resolver.service';
import { AdminComponent } from './admin/admin.component';
import { CareComponent } from './care/care.component';
import { CareService } from './services/care/care.service';
import { LangService } from './services/lang.service';
import { CompanyService } from './services/company.service';
import { PagerService } from './services/pager.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from './services/message.service';
import { TabService } from './services/tab.service';
import { IconService } from './services/icon.service';
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AdminComponent,
    CareComponent,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    NoopAnimationsModule,
    //custom
    SharedModule,
    CoreModule,
    AuthModule,
  ],
  providers: [
    AuthService,
    AuthGuardService,
    ProfileResolverService,
    CareService,
    LangService,
    CompanyService,
    PagerService,
    MessageService,
    TabService,
    IconService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptorService,
      multi: true
    },
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
