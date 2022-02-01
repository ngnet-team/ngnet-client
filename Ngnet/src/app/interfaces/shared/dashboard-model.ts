import { IDashboardContentModel } from "./dashboard-content-model";
import { IDashboardHeaderModel } from "./dashboard-header-model";

export interface IDashboardModel {
    header?: IDashboardHeaderModel[],
    content?: IDashboardContentModel[],
    filters?: any,
}