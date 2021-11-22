import { IUserExperianceModel } from "./user-experiance-model";

export interface IAdminUserModel {
    id?: string,
    email?: string,
    userName?: string,
    firstName?: string,
    lastName?: string,
    gender?: number,
    age?: number,
    roleName?: string
    createdOn?: string,
    modifiedOn?: string,
    deletedOn?: string,
    isDeleted?: boolean
    experiances?: IUserExperianceModel[],
    permanentDeletion?: boolean
}