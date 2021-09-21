import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IErrorModel } from 'src/app/interfaces/response-error-model';
import { LangService } from 'src/app/services/lang.service';
import { environment } from 'src/environments/environment';
import { ILoginModel } from '../../interfaces/login-model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  serverErrors: IErrorModel[] = [];
  langEvent: Subscription[] = [];
  selectedLang: string = environment.lang.default;
  menu: any = this.langService.get(this.selectedLang).login;
  validations: any = this.langService.get(this.selectedLang).validations;

  constructor(private authService: AuthService, private route: Router, private langService: LangService) {
    this.langListener();
   }

  login(input: ILoginModel): void {
    this.serverErrors = [] as IErrorModel[];

    this.authService.login(input).subscribe({
      next: (res) => {
        if (res.token) {
          this.authService.setToken(res.token);
        }
        this.authService.logginEvent.emit(true);
        this.route.navigateByUrl('profile');
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
      this.menu = result.login;
      this.validations = result.validations;
    }))
  }
}
