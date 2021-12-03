import { Component, DoCheck, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IDropDownModel } from '../interfaces/dropdown/dropdown-model';
import { IErrorModel } from '../interfaces/response-error-model';
import { ICareModel } from '../interfaces/care/care-model';
import { LangService } from '../services/lang.service';
import { CareService } from '../services/care/care.service';
import { IDefaultCareModel } from '../interfaces/care/default-care-model';
import { IPageModel } from '../interfaces/page-model';
import { PagerService } from '../services/pager.service';
import { ICompanyModel } from '../interfaces/company-model';
import { MessageService } from '../services/message.service';
import { PagerBase } from '../shared/base-classes/pager-base';
import { IPopupModel } from '../interfaces/popup-model';
import { IconService } from '../services/icon.service';
import { IDropDownOutputModel } from '../interfaces/dropdown/dropdown-output';

@Component({
  selector: 'app-care',
  templateUrl: './care.component.html',
  styleUrls: ['./care.component.scss']
})
export class CareComponent extends PagerBase implements DoCheck {

  //models
  cares: ICareModel[] = [];
  defaultCare: IDefaultCareModel = { isDeleted: false, company: {} };
  pagedCares: ICareModel[] = [];
  names: IDropDownModel = {};

  @Output() pager: IPageModel = this.pagerService.model;
  @Output() company: ICompanyModel = this.defaultCare.company;
  @Output() confirmPopup: IPopupModel = { visible: false, confirmed: false, type: 'confirm', getData: { from: 'care' } };
  @Output() infoPopup: IPopupModel = { visible: false, confirmed: false, type: 'info', getData: { from: 'care' } };
  @Output() pageDropdown: IDropDownOutputModel = { field: 'pages', type: 'state', value: '' };
  @Output() filterDropdown: IDropDownOutputModel = { field: 'filterCare', type: 'state', value: '' };
  //temporary
  deletingCare: ICareModel | undefined;
  editingCareId: string | undefined;
  editingCompanyId: number | undefined;
  saveClicked: boolean = this.defaultCare.company == {};
  //language
  menu: any = this.langService.get(this.selectedLang).care;
  //labels
  careType: string = this.route.url.slice(1);
  noCares: string = this.menu[this.careType].noCaresFound;
  title: string = this.menu[this.careType].title;
  icons: any = this.iconService.get(this.component.care);

  constructor(
    langService: LangService,
    pagerService: PagerService,
    private careService: CareService,
    private route: Router,
    private messageService: MessageService,
    private iconService: IconService
  ) {
    super(pagerService, langService);
    this.loadNames();
    this.self();
    this.listener();
    this.pagerService.setPerPage(4);
  }

  ngDoCheck(): void {
    if (this.confirmPopupChecker(this.confirmPopup).confirmed) {
      this.remove();
    }
    //change language only the value is different and existing one
    if (this.pageDropdown.value !== this.selectedLang && this.pageDropdown.value) {
      this.pagerService.setPerPage(+this.pageDropdown.value);
      this.pagedCares = this.pagination(this.cares);
    }
    //DROPDOWN input: change filter only the value is different and existing one
    if (this.filterDropdown.value) {
      this.sort(this.filterDropdown.value);
    }
  }

  self(): void {
    this.careService.self(this.careType).subscribe({
      next: (res) => {
        this.errors = [];
        this.cares = res;
        //results view
        this.pagedCares = this.pagination(this.cares);
        //no items in the page
        if (this.pagedCares.length === 0 && this.pagerService.model.totalPages > 1) {
          //TODO re-render results when the last item is deleted in current page to show previus one if avaliable 
        }
      },
      error: (err) => {
        if (err?.error?.errors) {
          this.unhandledServerError(err?.error.errors);
        } else if (err?.error) {
          this.serverErrors = err?.error;
          this.setServerError();
        };
      }
    });
  }

  save(model: ICareModel): void {
    //company selected
    if (this.defaultCare.company?.name === undefined) {
      model.company = undefined;
    } else {
      model.company = this.defaultCare.company;
    }

    //changing existing care
    if (this.editingCareId) {
      model.id = this.editingCareId;
      this.editingCareId = undefined;
    }

    //changing existing company
    if (this.editingCompanyId) {
      (model as IDefaultCareModel).company.id = this.editingCompanyId;
      this.editingCompanyId = undefined;
    }

    //avoid empty strings for validated properties in the server 
    if (model.company?.email === '') {
      model.company.email = undefined;
    }
    if (model.company?.phoneNumber === '') {
      model.company.phoneNumber = undefined;
    }

    this.serverErrors = {} as IErrorModel;

    this.careService.save(model, this.careType).subscribe({
      next: (res) => {
        if (res) {
          const msg = this.messageService.getMsg(res, this.selectedLang);
          this.messageService.event.emit(msg);
          this.messageService.remindClicked.emit(true);
          this.self();
        }
        this.defaultCare = { isDeleted: false, company: {} };
      },
      error: (err) => {
        if (err?.error?.errors) {
          this.unhandledServerError(err?.error.errors);
        } else if (err?.error) {
          this.serverErrors = err?.error;
          this.setServerError();
        };
      }
    });
  }

  remove(): void {
    const DeleteModel = (this.deletingCare as ICareModel)
    DeleteModel.isDeleted = true;
    this.save(DeleteModel);
  }

  edit(model: ICareModel): void {
    if (model.company === null) {
      model.company = { id: undefined };
    }
    this.defaultCare = (model as IDefaultCareModel);
    this.editingCareId = model.id;
    this.editingCompanyId = model.company?.id;
  }

  remind(model: ICareModel): void {
    this.careService.remind(model).subscribe({
      next: (res) => {
        const msg = this.messageService.getMsg(res, this.selectedLang);
        this.messageService.event.emit(msg);
        this.messageService.remindClicked.emit(true);
        this.self();
      },
      error: (err) => {
        if (err?.error?.errors) {
          this.unhandledServerError(err?.error.errors);
        } else if (err?.error) {
          this.serverErrors = err?.error;
          this.setServerError();
        };
      }
    });
  }

  openConfirmPopup(model: ICareModel): void {
    this.deletingCare = model;
    this.confirmPopup.visible = true;
  };

  openInfoPopup(model: ICareModel): void {
    this.infoPopup.getData.content = [];
    this.infoPopup.getData.content.push(model.notes);
    this.infoPopup.visible = true;
  }

  private loadNames(): void {
    this.careService.loadNames(this.careType).subscribe(res => {
      this.names = res;
    });
  }

  override langListener(): void {
    super.langListener(this.component.care);
    this.subscription.push(this.langService.langEvent.subscribe(result => {
      this.company = result.company;

      if (this.careType) {
        this.noCares = this.menu[this.careType].noCaresFound;
        this.title = this.menu[this.careType].title;
      }
    }));
  }

  override pagerListener(): void {
    this.subscription.push(this.pagerService.pageSelect.subscribe(pageNumber => {
      this.pager.pageNumber = pageNumber;
      this.pagedCares = this.pagination(this.cares);
    }));
  }

  private listener(): void {
    this.subscription.push(this.messageService.remindClicked.subscribe(click => {
      this.self();
    }));
  }

  private sort(type: string = 'newest'): void {
    switch (type) {
      case 'oldest':
        this.cares = this.cares
          .sort((a, b) => Date.parse(a.createdOn.toString()) - Date.parse(b.createdOn.toString()));
        break;
      case 'newest':
        this.cares = this.cares
          .sort((a, b) => Date.parse(b.createdOn.toString()) - Date.parse(a.createdOn.toString()));
        break;
      default:
        break;
    }
    this.pagedCares = this.pagination(this.cares);
  }
}
