import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found/not-found.component';
import { ServerNotFoundComponent } from './server-not-found/server-not-found.component';
import { PageComponent } from './page/page.component';
import { CompanyFormComponent } from './company-form/company-form.component';
import { FormsModule } from '@angular/forms';
import { DropdownComponent } from './dropdown/dropdown.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PopupComponent } from './popup/popup.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    NotFoundComponent,
    ServerNotFoundComponent,
    PageComponent,
    CompanyFormComponent,
    DropdownComponent,
    PopupComponent,
    DashboardComponent,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
  ],
  exports: [
    PageComponent,
    CompanyFormComponent,
    DropdownComponent,
    FontAwesomeModule,
    PopupComponent,
    DashboardComponent,
  ]
})
export class SharedModule { }
