export interface ICommentModel {
    createdOn: string,
    content: string,
    imageUrl: string,
    author: {
        name: string,
    },
}