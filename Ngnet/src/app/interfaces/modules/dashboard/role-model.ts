export interface IRoleModel {
    id: string,
    name: string,
    maxCount?: number,
    createdOn: Date,
    modifiedOn?: Date,
    deletedOn?: Date,
    isDeleted: boolean,
}