import { ICompanyModel } from "../company-model";

export interface IVehicleCareModel {
    id?: string,
    name?: string,
    startDate?: Date,
    endDate?: Date,
    paidEndDate?: Date,
    reminder?: Date,
    price?: number,
    company: ICompanyModel,
    notes?: string,
    userId?: string,
    isDeleted: boolean,
    deletedOn?: Date,
}