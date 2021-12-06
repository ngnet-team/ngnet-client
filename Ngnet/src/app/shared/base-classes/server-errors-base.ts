import { Router } from "@angular/router";
import { IErrorModel } from "src/app/interfaces/response-error-model";
import { IconService } from "src/app/services/icon.service";
import { environment } from "src/environments/environment";
import { LangService } from "../../services/lang.service";
import { Base } from "./base";

export class ServerErrorsBase extends Base {

    serverErrors: IErrorModel = {};
    errors: string[] | undefined;

    longError: number = 50;
    defaultMsg: string = 'This error is too long to be displayed. Please check the console for more information.';

    constructor(
        langService: LangService, 
        iconService: IconService, 
        protected router: Router
        ) {
        super(langService, iconService, router);
    }

    protected setServerError(): void {
        if (typeof this.serverErrors === 'string') {

            if ((this.serverErrors as string).length > this.longError) {
                this.errors = [this.defaultMsg];
                return;
            }

            this.errors?.push(this.serverErrors);
        } else {
            this.errors = this.selectedLang === environment.lang.bg ? this.serverErrors?.bg : this.serverErrors?.en;
        }
    }

    protected unhandledServerError(errors: any): void {
        for (const key in errors) {
            this.errors = [errors[key]];
        }
    }

    override langListener(component: string = 'none'): void {
        super.langListener(component);
        this.subscription.push(this.langService.langEvent.subscribe(result => {
            this.setServerError();
        }))
    }
}