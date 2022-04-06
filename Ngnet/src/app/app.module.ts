import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { AuthGuardService } from './services/guards/auth-guard.service';
import { ErrorInterceptorService } from './services/interceptors/error-interceptor.service';
import { HttpInterceptorService } from './services/interceptors/http-interceptor.service';
import { SharedModule } from './shared/shared.module';
import { HomeComponent } from './home/home.component';
import { ProfileResolverService } from './services/components/profile/profile-resolver.service';
import { CareComponent } from './care/care.component';
import { CareService } from './services/components/care/care.service';
import { LangService } from './services/common/lang/lang.service';
import { CompanyService } from './services/components/company/company.service';
import { PagerService } from './services/components/pager/pager.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from './services/common/message/message.service';
import { TabService } from './services/common/tab/tab.service';
import { IconService } from './services/common/icon/icon.service';
import { AuthService } from './services/auth/auth.service';
import { DashboardModule } from './dashboard/dashboard.module';
import { SocialModule } from './social/social.module';
import { FileService } from './services/common/file/file.service';
import { SocialService } from './services/components/social/social.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CareComponent,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NoopAnimationsModule,
    //custom
    SharedModule,
    CoreModule,
    AuthModule,
    SocialModule,
    DashboardModule,
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
    SocialService,
    FileService,
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
