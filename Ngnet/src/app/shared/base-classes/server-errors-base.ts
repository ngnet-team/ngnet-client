import { Subscription } from "rxjs";
import { IErrorModel } from "src/app/interfaces/response-error-model";
import { environment } from "src/environments/environment";
import { LangService } from "../../services/lang.service";
import { LangBase } from "./lang-base";

export class ServerErrorsBase extends LangBase {

    serverErrors: IErrorModel = {};
    errors: string[] | undefined;

    constructor(langService: LangService) {
        super(langService);
    }

    protected setServerError() {
        if (typeof this.serverErrors === 'string') {
            this.errors = [this.serverErrors];
        } else {
            this.errors = this.selectedLang === environment.lang.bg ? this.serverErrors?.bg : this.serverErrors?.en;
        }
    }

    protected unhandledServerError(errors: any) {
        for (const key in errors) {
            this.errors = errors[key];
        }
    }
}