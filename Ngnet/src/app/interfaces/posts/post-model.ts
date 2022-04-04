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
    like: number,
    dislike: number,
    laugh: number,
    heart: number,
    angry: number,
    own: string
}