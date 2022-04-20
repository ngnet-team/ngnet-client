import { ICommentModel } from "./comment-model";
import { IReactionModel } from "./reaction-model";

export interface IPostModel {
    id: string,
    title: string,
    content: string,
    imageUrl: string,
    author: {
        name: string,
    },
    receiverId: string,
    comments: ICommentModel[],
    reactions: IReactionModel[],
    createdOn: string,
    likes: number,
    dislikes: number,
    laughs: number,
    hearts: number,
    angries: number,
    own: string,
    showComments: boolean, 
}