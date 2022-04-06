import { Component, DoCheck, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IPopupModel } from 'src/app/interfaces/popup-model';
import { IPostModel } from 'src/app/interfaces/posts/post-model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FileService } from 'src/app/services/common/file/file.service';
import { IconService } from 'src/app/services/common/icon/icon.service';
import { LangService } from 'src/app/services/common/lang/lang.service';
import { PagerService } from 'src/app/services/components/pager/pager.service';
import { SocialService } from 'src/app/services/components/social/social.service';
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
  commentFields = [
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
    private socialService: SocialService,
  ) {
    super(langService, iconService, authService, router, fileService, pagerService);
    this.configPager(this.component.posts, 4);
    this.getPosts();
  }

  ngDoCheck(): void {
    //Form
    const form = this.formPopup.returnData;
    if (form) {
      if (form?.title) { //Post
        this.savePost(form);
      } else if (form) { //Comment
        this.saveComment(form, form.meta.postId);
      }
      this.formPopup.returnData = undefined;
    }
    //Confirm
    if (this.confirmPopup.confirmed) {
      if (this.confirmPopup.returnData?.post) {
        this.removePost(this.confirmPopup.returnData.post);
      } else if (this.confirmPopup.returnData?.comment) {
        this.removeComment(this.confirmPopup.returnData.comment);
      }
      this.confirmPopup.returnData = undefined;
      this.confirmPopup.confirmed = false;
    }
  }

  openFormPopup(input: any = undefined, postId: any = undefined) {
    this.formPopup.getData = {};

    if (input?.title) { //Update post
      this.formPopup.getData.fields = this.postFields.map(x => {
        x.value = input[x.name];
        return x;
      });
      this.formPopup.getData.meta = { id: input.id };
    } else if (input) { //Update comment
      this.formPopup.getData.fields = this.commentFields.map(x => {
        x.value = input[x.name];
        return x;
      });
      this.formPopup.getData.meta = { postId, id: input.id };
    } else { //Create post
      this.formPopup.getData.fields = this.postFields;
    }

    this.formPopup.visible = true;
  }

  openConfirmPopup(input: any) {
    this.confirmPopup.visible = true;
    this.confirmPopup.getData = input;
  }

  savePost(model: any) {
    var request;

    //Save file
    // if (model?.image) {
    //   this.fileService.save(model?.image).subscribe({
    //     next: (res) => {
    //       console.log(res);
    //     },
    //     error: (err) => {
    //       console.log(err);
    //     }
    //   });;
    // }

    if (!model?.meta) { //Create
      var user = this.authService.getParsedJwt();
      model.author = {
        id: user?.userId,
        name: user?.username,
      };
      request = this.socialService.addPost(model);
    } else { //Update
      model.id = model.meta?.id;
      request = this.socialService.updatePost(model)
    }

    request.subscribe({
      next: (res) => {
        this.getPosts();
      },
      error: (err) => {
        if (err?.error) {
          console.log(err);
          this.errors?.push(err.error[this.selectedLang]);
        }
      }
    });
  }

  removePost(postId: string) {
    this.socialService.removePost(postId).subscribe({
      next: (res) => {
        this.getPosts();
      },
      error: (err) => {
        if (err?.error) {
          console.log(err);
          this.errors?.push(err.error[this.selectedLang]);
        }
      }
    });
  }

  getPosts(commentId: any = undefined, reactionId: any = undefined): void {
    this.socialService.getPosts().subscribe({
      next: (res) => {
        this.posts = res;
        this.formatReactions(commentId, reactionId);
      },
      error: (err) => {
        if (err?.error) {
          console.log(err);
          this.errors?.push(err.error[this.selectedLang]);
        }
      }
    });
  }

  reactPost(postId: string, emoji: string): void {
    const authorId = this.authService.getParsedJwt()?.userId;
    var model = {
      authorId,
      postId,
      emoji,
    };

    this.socialService.reactPost(model).subscribe({
      next: (res) => {
        this.getPosts();
      },
      error: (err) => {
        if (err?.error) {
          console.log(err);
          this.errors?.push(err.error[this.selectedLang]);
        }
      }
    });
  }

  saveComment(model: any, postId: string) {
    var request;

    if (!model?.meta) { //Create
      const user = this.authService.getParsedJwt();
      model.author = {
        id: user?.userId,
        name: user?.username,
      };
      model.postId = postId;

      request = this.socialService.addComment(model);
    } else { //Update
      model.id = model.meta.id;
      request = this.socialService.updateComment(model);
    }

    request?.subscribe({
      next: (res) => {
        this.getPosts(res.id);
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
    this.socialService.removeComment({ commentId }).subscribe({
      next: (res) => {
        this.getPosts(res.id);
      },
      error: (err) => {
        if (err?.error) {
          console.log(err);
          this.errors?.push(err.error[this.selectedLang]);
        }
      }
    });
  }

  reactComment(commentId: string, emoji: string): void {
    const authorId = this.authService.getParsedJwt()?.userId;
    var model = {
      authorId,
      commentId,
      emoji,
    };

    this.socialService.reactComment(model).subscribe({
      next: (res) => {
        this.posts = this.posts.map(p => {
          p.comments = p.comments.map(c => {
            c.reactions = c.reactions.map(r => {
              if (r.id === res.id) {
                r = res;
              };
              return r;
            });
            return c;
          });
          return p;
        });

        this.formatReactions('', res.id);
      },
      error: (err) => {
        if (err?.error) {
          console.log(err);
          this.errors?.push(err.error[this.selectedLang]);
        }
      }
    });
  }

  private formatReactions(commentId: any = undefined, reactionId: any = undefined) {
    const authorId = this.authService.getParsedJwt()?.userId;
    let postId = '';

    this.posts = this.posts.map(p => {
      const hasReaction = p.reactions?.filter(x => x.authorId === authorId)[0];
      if (hasReaction) {
        p.own = hasReaction.emoji;
      }

      p.likes = p.reactions?.filter(x => x.emoji === 'like').length;
      p.dislikes = p.reactions?.filter(x => x.emoji === 'dislike').length;
      p.laughs = p.reactions?.filter(x => x.emoji === 'laugh').length;
      p.hearts = p.reactions?.filter(x => x.emoji === 'heart').length;
      p.angries = p.reactions?.filter(x => x.emoji === 'angry').length;

      p.comments = p.comments.sort((a, b) => b.createdOn.localeCompare(a.createdOn)).map(c => {
        const hasReaction = c.reactions?.filter(x => x.authorId === authorId)[0];
        if (hasReaction) {
          c.own = hasReaction.emoji;
        }

        c.likes = c.reactions?.filter(x => x.emoji === 'like').length;
        c.dislikes = c.reactions?.filter(x => x.emoji === 'dislike').length;
        c.laughs = c.reactions?.filter(x => x.emoji === 'laugh').length;
        c.hearts = c.reactions?.filter(x => x.emoji === 'heart').length;
        c.angries = c.reactions?.filter(x => x.emoji === 'angry').length;

        if (c.id === commentId) {
          postId = p.id;
        }
        if (c.reactions.filter(r => r.id === reactionId).length > 0) {
          postId = p.id;
        }

        return c;
      });

      p.hiddenComments = p.id !== postId ? true : false;
      return p;
    });
  }
}
