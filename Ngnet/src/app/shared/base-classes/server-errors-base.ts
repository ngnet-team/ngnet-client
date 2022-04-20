import { Router } from "@angular/router";
import { IErrorModel } from "src/app/interfaces/response-error-model";
import { AuthService } from "src/app/services/auth/auth.service";
import { FileService } from "src/app/services/common/file/file.service";
import { IconService } from "src/app/services/common/icon/icon.service";
import { environment } from "src/environments/environment";
import { LangService } from "../../services/common/lang/lang.service";
import { Base } from "./base";

export class ServerErrorsBase extends Base {

    serverError: IErrorModel | undefined;
    errors: string[] | undefined;

    longError: number = 50;
    defaultMsg: string = 'This error is too long to be displayed. Please check the console for more information.';

    constructor(
        langService: LangService,
        iconService: IconService,
        protected authService: AuthService,
        protected router: Router,
        fileService: FileService,
    ) {
        super(langService, iconService, authService, router, fileService);
    }

    protected setServerError(): void {
        if (typeof this.serverError === 'string') {

            if ((this.serverError as string).length > this.longError) {
                this.errors = [this.defaultMsg];
                return;
            }

            this.errors?.push(this.serverError);
        } else {
            this.errors = this.selectedLang === environment.lang.bg ? this.serverError?.bg : this.serverError?.en;
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