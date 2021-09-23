import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';
import { ErrorInterceptorService } from './services/interceptors/error-interceptor.service';
import { HttpInterceptorService } from './services/interceptors/http-interceptor.service';
import { SharedModule } from './shared/shared.module';
import { HomeComponent } from './home/home.component';
import { ProfileResolverService } from './services/profile-resolver.service';
import { AdminComponent } from './admin/admin.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { VehicleService } from './services/vehicle.service';
import { LangService } from './services/lang.service';
import { HealthComponent } from './health/health.component';
import { HealthService } from './services/health.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AdminComponent,
    VehicleComponent,
    HealthComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    SharedModule,
    CoreModule,
    AuthModule,
  ],
  providers: [
    AuthService,
    AuthGuardService,
    ProfileResolverService,
    VehicleService,
    HealthService,
    LangService,
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
