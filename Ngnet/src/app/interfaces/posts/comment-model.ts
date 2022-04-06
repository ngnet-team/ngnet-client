import { IReactionModel } from "./reaction-model";

export interface ICommentModel {
    _id: string,
    createdOn: string,
    content: string,
    imageUrl: string,
    author: {
        name: string,
    },
    reactions: IReactionModel[],
    likes: number,
    dislikes: number,
    laughs: number,
    hearts: number,
    angries: number,
    own: string,
}