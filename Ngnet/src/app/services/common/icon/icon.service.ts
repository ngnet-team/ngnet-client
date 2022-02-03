import { Injectable } from '@angular/core';
import { fas } from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root'
})
export class IconService {

  model: any = {
    nav: {
      hamburger: fas.faBars,
      profile: fas.faUser,
      logout: fas.faSignOutAlt,
      login: fas.faSignInAlt,
      register: fas.faUserPlus,
      bell: fas.faBell,
      close: fas.faTimesCircle,
    },
    care: {
      more: fas.faPlus,
      title: {
        healthcare: fas.faAmbulance,
        vehiclecare: fas.faCar,
      },
      toggleOn: fas.faToggleOn,
      toggleOff: fas.faToggleOff,
    },
    dropdown: {
      dropdown: fas.faCaretDown,
      option: fas.faCheck,
      admin: fas.faChessKing,
      manager: fas.faPoll,
      language: fas.faGlobe,
      pager: fas.faPager,
      filter: fas.faFilter,
    },
    popup: {
      close: fas.faTimesCircle,
    },
    pager: {
      doubleLeft: fas.faAngleDoubleLeft,
      left: fas.faAngleLeft,
      right: fas.faAngleRight,
      doubleRight: fas.faAngleDoubleRight,
    },
    company: {
      company: fas.faBuilding,
      phoneNumber: fas.faPhone,
      email: fas.faEnvelopeOpen,
      webSite: fas.faSitemap,
      address: fas.faAddressCard
    },
    admin: {
      more: fas.faPlus,
      edit: fas.faPencilAlt,
    },
    notification: {
      more: fas.faPlus,
      less: fas.faMinus,
      close: fas.faTimesCircle,
    },
    dashboard: {
      more: fas.faPlus,
      edit: fas.faPencilAlt,
      sort: fas.faSort,
    },
  };

  constructor() { }

  get(field: string): any {
    return this.model[field];
  }
}
