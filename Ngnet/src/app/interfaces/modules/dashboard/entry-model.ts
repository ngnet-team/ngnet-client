import { Data } from "@angular/router";

export interface IEntryModel {
    userId?: string,
    username?: string,
    login?: boolean,
    createdOn?: Data,
}