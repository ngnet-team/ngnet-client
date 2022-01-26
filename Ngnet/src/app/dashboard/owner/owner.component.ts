import { Component } from '@angular/core';
import { IRoleModel } from 'src/app/interfaces/modules/dashboard/role-model';
import { DashboardService } from 'src/app/services/modules/dashboard/dashboard.service';

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.scss']
})
export class OwnerComponent {

  roles: IRoleModel[] = [];

  constructor(private dashboardService: DashboardService) {
    this.getRoles();
  }

  setMaxRoles(maxRoles: IRoleModel): void {
    console.log(maxRoles)
    return;
    this.dashboardService.setMaxRoles(maxRoles);
  }

  getRoles(): void {
    this.dashboardService.getRoles().subscribe(res => {
      this.roles = res;
    });
  }
}
