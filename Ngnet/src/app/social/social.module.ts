import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsComponent } from './posts/posts.component';
import { SocialRoutingModule } from './social-routing.module';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    PostsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SocialRoutingModule,
  ],
  exports: [
    PostsComponent,
  ]
})
export class SocialModule { }
