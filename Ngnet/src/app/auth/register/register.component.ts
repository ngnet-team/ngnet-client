import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IErrorModel } from 'src/app/interfaces/response-error-model';
import { LangService } from 'src/app/services/lang.service';
import { environment } from 'src/environments/environment';
import { IRegisterModel } from '../../interfaces/register-model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  serverErrors: IErrorModel[] = [];
  langEvent: Subscription[] = [];
  selectedLang: string = environment.lang.default;
  menu: any = this.langService.get(this.selectedLang).register;
  validations: any = this.langService.get(this.selectedLang).validations;

  constructor(private authService: AuthService, private route: Router, private langService: LangService) {
    this.langListener();
   }

  register(input: IRegisterModel): void {
    this.serverErrors = [] as IErrorModel[];

    this.authService.register(input).subscribe({
      next: () => {
        this.route.navigateByUrl('login');
      }, 
      error: (err) => {
        (err?.error as []).forEach(e => {
          this.serverErrors.push(e);
        });
      }
    });
  }

  private langListener(): void {
    this.langEvent.push(this.langService.langEvent.subscribe(result => {
      this.menu = result.register;
      this.validations = result.validations;
    }))
  }
}
