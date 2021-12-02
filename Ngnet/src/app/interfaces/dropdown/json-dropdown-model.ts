import { IDropDownOptionModel } from "./dropdown-option-model";

export interface IJsonDropDownModel {
    small?: boolean; 
    icon: string;
    title?: string;
    options?: IDropDownOptionModel[],
}