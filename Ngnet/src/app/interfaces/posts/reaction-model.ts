export interface IReactionModel {
    id: string,
    authorId: string,
    postId: string,
    commentId: string,
    emoji: string,
    isDeleted: boolean,
}