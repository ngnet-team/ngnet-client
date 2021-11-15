import { Injectable } from '@angular/core';
import {
  faBars, faLanguage, faPoll, faUser, faSignOutAlt, faSignInAlt, faUserPlus, faChessKing, //nav
  faPlus, faAmbulance, faCar, //care 
  faCaretDown, faCheckDouble, //dropdown
  faTimesCircle, //popup
  faAngleDoubleLeft, faAngleLeft, faAngleRight, faAngleDoubleRight, //pager
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
  ];

  constructor() { }

  get(field: string): any {
    return Object.values(this.model)
      .filter(x => x.field === field)[0].icons;
  }
}
