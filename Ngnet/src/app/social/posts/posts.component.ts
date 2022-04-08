import { Component, DoCheck, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IPopupModel } from 'src/app/interfaces/popup-model';
import { IPostModel } from 'src/app/interfaces/posts/post-model';
import { IReactionModel } from 'src/app/interfaces/posts/reaction-model';
import { ICommentModel } from 'src/app/interfaces/posts/comment-model';
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
      next: (post) => {
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
      next: (post) => {
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

  getPosts(): void {
    this.socialService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.updateData();
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
      next: (reaction) => {
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
      next: (comment) => {
        this.updateData(comment);
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
    this.socialService.removeComment({ commentId }).subscribe({
      next: (comment) => {
        this.updateData(comment);
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
      next: (reaction) => {
        this.updateData(reaction);
      },
      error: (err) => {
        if (err?.error) {
          console.log(err);
          this.errors?.push(err.error[this.selectedLang]);
        }
      }
    });
  }

  private updateData(input: any = undefined) {
    let comment = input?.content ? input as ICommentModel : undefined;
    let reaction = input?.emoji ? input as IReactionModel : undefined;

    let touchedPostId = '';

    this.posts = this.posts.map(p => {
      this.highlightReaction(p);

      const newComment = comment && comment?.postId === p.id &&
        p.comments.filter(c => c.id === comment?.id).length === 0;

      for (let i = 0; i < p.comments.length; i++) {
        let c = p.comments[i];
        this.highlightReaction(c);

        if (!touchedPostId) {
          if (newComment) { //modify Created
            p.comments.push(comment as ICommentModel);
            touchedPostId = p.id;
          } else if (c.id === comment?.id) {
            if (comment?.isDeleted) { //modify Deleted
              p.comments.splice(i, 1);
            } else { //modify Updated
              p.comments[i] = comment as ICommentModel;
            }
            touchedPostId = p.id;
          } 
        }

        //Reactions
        // c.reactions.filter(r => r.id === reaction?.id).length > 0;
      }

      p.hiddenComments = !touchedPostId || touchedPostId !== p.id ? true : false;

      p.comments.sort((a, b) => b.createdOn.localeCompare(a.createdOn));
      return p;
    });
  }

  emojiLength(reactions: IReactionModel[], emoji: string) {
    return reactions?.filter(x => x.emoji === emoji)?.length;
  }

  highlightReaction(input: any) { //post or comment
    const element = input?.content ? input as IPostModel :
      input as ICommentModel;

    const authorId = this.authService.getParsedJwt()?.userId;
    const ownReaction = element.reactions?.filter(x => x.authorId === authorId)[0];
    if (ownReaction) {
      element.own = ownReaction.emoji;
    }
  }
}
