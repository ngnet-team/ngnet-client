import { Injectable } from '@angular/core';
import {
  faBars, faLanguage, faPoll, faUser, faSignOutAlt, faSignInAlt, faUserPlus, faChessKing, faBell, //nav
  faPlus, faAmbulance, faCar, //care 
  faCaretDown, faCheckDouble, //dropdown
  faTimesCircle, //popup
  faAngleDoubleLeft, faAngleLeft, faAngleRight, faAngleDoubleRight, //pager
  faBuilding, faPhone, faAddressCard, faSitemap, faEnvelopeOpen, //companyForm
  faPencilAlt, //admin
} from '@fortawesome/free-solid-svg-icons';
import { IIconModel } from '../interfaces/icon-model';

@Injectable({
  providedIn: 'root'
})
export class IconService {

  model: IIconModel[] = [
    {
      field: 'nav',
      icons:
      {
        hamburger: faBars,
        language: faLanguage,
        manager: faPoll,
        profile: faUser,
        logout: faSignOutAlt,
        login: faSignInAlt,
        register: faUserPlus,
        admin: faChessKing,
        bell: faBell,
        close: faTimesCircle,
      },
    },
    {
      field: 'care',
      icons:
      {
        more: faPlus,
        title: {
          healthcare: faAmbulance,
          vehiclecare: faCar,
        }
      },
    },
    {
      field: 'dropdown',
      icons:
      {
        dropdown: faCaretDown,
        option: faCheckDouble,
      },
    },
    {
      field: 'popup',
      icons:
      {
        close: faTimesCircle,
      },
    },
    {
      field: 'pager',
      icons:
      {
        doubleLeft: faAngleDoubleLeft,
        left: faAngleLeft,
        right: faAngleRight,
        doubleRight: faAngleDoubleRight,
      },
    },
    {
      field: 'companyForm',
      icons:
      {
        company: faBuilding,
        phoneNumber: faPhone,
        email: faEnvelopeOpen,
        webSite: faSitemap,
        address: faAddressCard
      },
    },
    {
      field: 'admin',
      icons:
      {
        more: faPlus,
        edit: faPencilAlt,
      },
    },
  ];

  constructor() { }

  get(field: string): any {
    return Object.values(this.model)
      .filter(x => x.field === field)[0].icons;
  }
}
