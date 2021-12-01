import { ICompanyModel } from "../company-model";

export interface ICareModel {
    id?: string,
    name?: string,
    startDate?: Date,
    endDate?: Date,
    paidEndDate?: Date,
    reminder?: Date,
    remind?: boolean,
    price?: number,
    company?: ICompanyModel,
    notes?: string,
    userId?: string,
    isDeleted: boolean,
    deletedOn?: Date,
    read?: boolean,
}