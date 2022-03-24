import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IRoleModel } from 'src/app/interfaces/modules/dashboard/role-model';
import { IconService } from 'src/app/services/common/icon/icon.service';
import { LangService } from 'src/app/services/common/lang/lang.service';
import { MessageService } from 'src/app/services/common/message/message.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DashboardService } from 'src/app/services/components/dashboard/dashboard.service';
import { Base } from 'src/app/shared/base-classes/base';

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.scss']
})
export class OwnerComponent extends Base {
  
  roles: IRoleModel[] = [];
  
  constructor(
    langService: LangService,
    iconService: IconService,
    authService: AuthService,
    router: Router,
    private dashboardService: DashboardService,
    private messageService: MessageService,
    ) {
      super(langService, iconService, authService, router);
      this.config(this.component.admin);
      this.getRoles();
    }
    
    setMaxRoles(maxRoles: IRoleModel): void {
    this.dashboardService.setMaxRoles([maxRoles]).subscribe(res => {
      const msg = this.messageService.getMsg(res, this.selectedLang);
      this.messageService.event.emit(msg);
    });
  }

  getRoles(): void {
    this.dashboardService.getRoles().subscribe(res => {
      this.roles = res;
    });
  }
}
