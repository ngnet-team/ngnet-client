import { IReactionModel } from "./reaction-model";

export interface ICommentModel {
    id: string,
    createdOn: string,
    content: string,
    imageUrl: string,
    author: {
        name: string,
    },
    postId: string,
    reactions: IReactionModel[],
    own: string,
    isDeleted: boolean,
}