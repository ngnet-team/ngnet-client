import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found/not-found.component';
import { ServerNotFoundComponent } from './server-not-found/server-not-found.component';
import { PageComponent } from './page/page.component';
import { CompanyFormComponent } from './company-form/company-form.component';
import { FormsModule } from '@angular/forms';
import { DropdownComponent } from './dropdown/dropdown.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ChangePopupComponent } from './change-popup/change-popup.component';

@NgModule({
  declarations: [
    NotFoundComponent,
    ServerNotFoundComponent,
    PageComponent,
    CompanyFormComponent,
    DropdownComponent,
    ChangePopupComponent,
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
    ChangePopupComponent,
  ]
})
export class SharedModule { }
