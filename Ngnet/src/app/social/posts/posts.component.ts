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
  postFields = [
    { label: 'Title', name: 'title', value: '' },
    { label: 'Content', name: 'content', value: '' },
  ];
  @Output() formPopup: IPopupModel = { type: 'form', visible: false, from: 'post' };
  @Output() confirmPopup: IPopupModel = { type: 'confirm', visible: false, confirmed: false, from: 'post' };

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
    if (this.formPopup.returnData) {
      if (this.formPopup.returnData.id) {
        this.edit(this.formPopup.returnData);
      } else {
        this.create(this.formPopup.returnData);
      }
      this.formPopup.returnData = undefined;
    }
    if (this.confirmPopup.confirmed) {
      this.remove(this.confirmPopup.returnData);
      this.confirmPopup.returnData = undefined;
      this.confirmPopup.confirmed = false;
    }
  }

  openFormPopup(post: any = undefined) {
    this.formPopup.visible = true;
    this.formPopup.getData = {};
    //Edit existing
    if (post) {
      this.postFields = this.postFields.map(x => {
        x.value = post[x.name];
        return x;
      });
      this.formPopup.getData.id = post.id;
    }
    this.formPopup.getData.fields = this.postFields;
  }

  openConfirmPopup(post: any) {
    this.confirmPopup.visible = true;
    this.confirmPopup.getData = post;
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
    this.postService.create(model).subscribe({
      next: (res) => {
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

  edit(model: any) {
    this.postService.update(model).subscribe({
      next: (res) => {
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

  remove(post: any) {
    this.postService.delete(post.id).subscribe({
      next: (res) => {
        console.log(res);
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
