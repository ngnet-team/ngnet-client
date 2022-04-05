import { Component, DoCheck, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IPopupModel } from 'src/app/interfaces/popup-model';
import { IPostModel } from 'src/app/interfaces/posts/post-model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FileService } from 'src/app/services/common/file/file.service';
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

  user = this.authService.getParsedJwt();
  posts: IPostModel[] = [];
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
    fileService: FileService,
    pagerService: PagerService,
    private postService: PostService,
  ) {
    super(langService, iconService, authService, router, fileService, pagerService);
    this.configPager(this.component.posts, 4);
    this.getAll();
  }

  ngDoCheck(): void {
    if (this.formPopup.returnData) {
      console.log(this.formPopup.returnData);
      // if (this.formPopup.returnData.id) {
      //   this.edit(this.formPopup.returnData);
      // } else {
      //   this.create(this.formPopup.returnData);
      // }
      this.formPopup.returnData = undefined;
    }
    if (this.confirmPopup.confirmed) {
      if (this.confirmPopup.returnData?.post) {
        this.remove(this.confirmPopup.returnData.post);
      } else if (this.confirmPopup.returnData?.comment) {
        this.removeComment(this.confirmPopup.returnData.comment);
      }
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

  openConfirmPopup(input: any) {
    this.confirmPopup.visible = true;
    this.confirmPopup.getData = input;
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

  remove(postId: string) {
    this.postService.delete(postId).subscribe({
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
        this.posts = this.formatReactions(res as IPostModel[]);
      },
      error: (err) => {
        if (err?.error) {
          console.log(err);
          this.errors?.push(err.error[this.selectedLang]);
        }
      }
    });
  }

  react(postId: string, emoji: string): void {
    const authorId = this.authService.getParsedJwt()?.userId;
    var model = {
      authorId,
      postId,
      emoji,
    };

    this.postService.react(model).subscribe({
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

  addComment(postId: string, input: any) {
    const user = this.authService.getParsedJwt();
    var model = {
      author: {
        id: user?.userId,
        name: user?.username,
      },
      postId,
      content: input.content,
    };

    this.postService.addComment(model).subscribe({
      next: (res) => {
        this.getAll();
        this.posts = this.posts.map(x => {
          if (x.id === res.id) {
            x.hiddenComments = false;
          }
          return x;
        });
      },
      error: (err) => {
        if (err?.error) {
          console.log(err);
          this.errors?.push(err.error[this.selectedLang]);
        }
      }
    });
  }

  removeComment(commentId: string) {
    console.log(commentId)
    this.postService.removeComment({ commentId }).subscribe({
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

  private formatReactions(response: IPostModel[]) {
    const authorId = this.authService.getParsedJwt()?.userId;

    return response.map(x => {
      const hasReaction = x.reactions.filter(x => x.authorId === authorId)[0];
      if (hasReaction) {
        x.own = hasReaction.emoji;
      }

      x.likes = x.reactions.filter(x => x.emoji === 'like').length;
      x.dislikes = x.reactions.filter(x => x.emoji === 'dislike').length;
      x.laughs = x.reactions.filter(x => x.emoji === 'laugh').length;
      x.hearts = x.reactions.filter(x => x.emoji === 'heart').length;
      x.angries = x.reactions.filter(x => x.emoji === 'angry').length;

      x.comments = x.comments.sort((a, b) => b.createdOn.localeCompare(a.createdOn));
      x.hiddenComments = true;
      return x;
    });
  }
}
