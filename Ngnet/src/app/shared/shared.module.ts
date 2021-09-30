import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found/not-found.component';
import { ServerNotFoundComponent } from './server-not-found/server-not-found.component';
import { PageComponent } from './page/page.component';
import { CompanyFormComponent } from './company-form/company-form.component';
import { FormsModule } from '@angular/forms';
import { DropdownComponent } from './dropdown/dropdown.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    NotFoundComponent,
    ServerNotFoundComponent,
    PageComponent,
    CompanyFormComponent,
    DropdownComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [
    PageComponent,
    CompanyFormComponent,
    DropdownComponent,
    MatFormFieldModule, MatInputModule
  ]
})
export class SharedModule { }
