import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found/not-found.component';
import { ServerNotFoundComponent } from './server-not-found/server-not-found.component';
import { PageComponent } from './page/page.component';
import { PagerService } from '../services/pager.service';



@NgModule({
  declarations: [
    NotFoundComponent,
    ServerNotFoundComponent,
    PageComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PageComponent
  ]
})
export class SharedModule { }
