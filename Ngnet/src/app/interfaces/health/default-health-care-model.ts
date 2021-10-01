import { ICompanyModel } from "../company-model";

export interface IDefaultHealthCareModel {
    id?: string,
    name?: string,
    date?: Date,
    reminder?: Date,
    price?: number,
    company: ICompanyModel,
    notes?: string,
    userId?: string,
    isDeleted: boolean,
    deletedOn?: Date,
}