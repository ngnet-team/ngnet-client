import { Component, DoCheck, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IPopupModel } from 'src/app/interfaces/popup-model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { IconService } from 'src/app/services/common/icon/icon.service';
import { LangService } from 'src/app/services/common/lang/lang.service';
import { PagerService } from 'src/app/services/components/pager/pager.service';
import { PostService } from 'src/app/services/components/post/post.service';
import { PagerBase } from 'src/app/shared/base-classes/pager-base';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent extends PagerBase implements DoCheck {

  posts: any = [];
  postFields: any = [
    { label: 'Title', value: 'title' },
    { label: 'Content', value: 'content' },
  ];
  @Output() createFormPopup: IPopupModel = { visible: false, confirmed: false, type: 'form', getData: { from: 'post' } };

  constructor(
    langService: LangService,
    iconService: IconService,
    authService: AuthService,
    router: Router,
    pagerService: PagerService,
    private postService: PostService,
  ) {
    super(langService, iconService, authService, router, pagerService);
    this.configPager(this.component.post, 4);
    this.getAll();
  }

  ngDoCheck(): void {
    var formData = this.createFormPopup.returnData;
    if (formData) {
      this.create(formData);
      this.createFormPopup.returnData = undefined;
    }
  }

  openCreateForm() {
    this.createFormPopup.getData.fields = this.postFields;
    this.createFormPopup.visible = true;
  }

  create(model: any) {
    var user = this.authService.getParsedJwt();

    if (!user) {
      console.log('no logged user!');
    }

    model.author = {
      id: user?.userId,
      name: user?.username,
    };
    console.log(model);
    this.postService.create(model).subscribe({
      next: (res) => {
        console.log(this.posts);
        this.getAll();
      },
      error: (err) => {
        if (err?.error) {
          console.log(err);
          this.errors?.push(err.error[this.selectedLang]);
        }
      }
    });
  }

  getAll(): void {
    this.postService.getAll().subscribe({
      next: (res) => {
        this.posts = res;
      },
      error: (err) => {
        if (err?.error) {
          console.log(err);
          this.errors?.push(err.error[this.selectedLang]);
        }
      }
    });
  }
}
