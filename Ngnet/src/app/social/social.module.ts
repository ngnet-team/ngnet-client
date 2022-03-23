import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsComponent } from './posts/posts.component';
import { SocialRoutingModule } from './social-routing.module';



@NgModule({
  declarations: [
    PostsComponent
  ],
  imports: [
    CommonModule,
    SocialRoutingModule,
  ],
  exports: [
    PostsComponent,
  ]
})
export class SocialModule { }
