import { Injectable } from '@angular/core';
import {
  faBars, faLanguage, faPoll, faUser, faSignOutAlt, faSignInAlt, faUserPlus, faChessKing, faBell, //nav
  faPlus, faAmbulance, faCar, faToggleOn, faToggleOff, faPager, //care 
  faCaretDown, faCheckDouble, //dropdown
  faTimesCircle, faMinus, //popup
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
        },
        toggleOn: faToggleOn,
        toggleOff: faToggleOff,
        pager: faPager,
      },
    },
    {
      field: 'dropdown',
      icons:
      {
        dropdown: faCaretDown,
        option: faCheckDouble,
        admin: faChessKing,
        manager: faPoll,
        language: faLanguage,
        pager: faPager,
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
    {
      field: 'notification',
      icons:
      {
        more: faPlus,
        less: faMinus,
        close: faTimesCircle,
      },
    },
  ];

  constructor() { }

  get(field: string): any {
    return Object.values(this.model)
      .filter(x => x.field === field)[0].icons;
  }
}
