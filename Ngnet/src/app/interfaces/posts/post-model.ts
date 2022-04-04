import { IReactionModel } from "./reaction-model";

export interface IPostModel {
    title: string,
    content: string,
    imageUrl: string,
    author: {},
    receiverId: string,
    comments: [],
    reactions: IReactionModel[],
    createdOn: Date,
    likes: number,
    dislikes: number,
    laughs: number,
    hearts: number,
    angries: number,
    own: string
}