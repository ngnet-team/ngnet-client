import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found/not-found.component';
import { ServerNotFoundComponent } from './server-not-found/server-not-found.component';



@NgModule({
  declarations: [
    NotFoundComponent,
    ServerNotFoundComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
