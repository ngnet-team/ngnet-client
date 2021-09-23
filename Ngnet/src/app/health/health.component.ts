import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IHealthCareModel } from '../interfaces/health/health-care-model';
import { IHealthNames } from '../interfaces/health/health-names';
import { IErrorModel } from '../interfaces/response-error-model';
import { HealthService } from '../services/health.service';
import { LangService } from '../services/lang.service';

@Component({
  selector: 'app-health',
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.scss']
})
export class HealthComponent {

  serverErrors: IErrorModel[] = [];
  healthCares: IHealthCareModel[] = [];
  defaultHealthCares: IHealthCareModel = { isDeleted: false };
  editingId: string | undefined;
  langEvent: Subscription[] = [];
  selectedLang: string = this.langService.langState;
  menu: any = this.langService.get(this.selectedLang).healthcare;
  names: IHealthNames = {};

  constructor(private healthService: HealthService, private langService: LangService, private route: Router) { 
    this.loadNames();
    this.langListener();
    this.self();
  }

  loadNames(): void {
    this.healthService.loadNames().subscribe(res => {
      this.names = res;
    });
  }

  save(model: IHealthCareModel): void {
    
    if (this.editingId) {
      model.id = this.editingId;
      this.editingId = undefined;
    }

    this.serverErrors = [] as IErrorModel[];
    
    this.healthService.save(model).subscribe({
      next: (res) => {
        if (res > 0) {
          this.self();
        }
        this.defaultHealthCares = { isDeleted: false };
      },
      error: (err) => {
        (err?.error as []).forEach(e => {
          this.serverErrors.push(e);
        });
      }
    });
  }
  
  self(): void {
    this.healthService.self().subscribe({
      next: (res) => {
        this.healthCares = (res as IHealthCareModel[]).filter(x => x.isDeleted === false);
      },
      error: (err) => {
        (err?.error as []).forEach(e => {
          this.serverErrors.push(e);
        });
      }
    });;
  }
  
  remove(vehicleId: string | undefined): void {
    
    const model: IHealthCareModel = { isDeleted: true, id: vehicleId };
    this.save(model);
  }
  
  edit(model: IHealthCareModel): void {
    this.defaultHealthCares = model;
    this.editingId = model.id;
  }

  back(): void {
    this.route.navigateByUrl("manager");
  }
  
  private langListener(): void {
    this.langEvent.push(this.langService.langEvent.subscribe(result => {
      this.selectedLang = result.language;
      this.menu = result.healthcare;
    }))
  }
}
