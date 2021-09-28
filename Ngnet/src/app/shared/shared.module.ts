import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found/not-found.component';
import { ServerNotFoundComponent } from './server-not-found/server-not-found.component';
import { PageComponent } from './page/page.component';
import { CompanyFormComponent } from './company-form/company-form.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    NotFoundComponent,
    ServerNotFoundComponent,
    PageComponent,
    CompanyFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
    PageComponent,
    CompanyFormComponent
  ]
})
export class SharedModule { }
