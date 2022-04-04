export interface ICommentModel {
    _id: string,
    createdOn: string,
    content: string,
    imageUrl: string,
    author: {
        name: string,
    },
}