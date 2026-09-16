import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface IMenuItem {
  type: 'link' | 'dropDown' | 'icon' | 'separator' | 'extLink';
  name?: string;
  state?: string;
  icon?: string;
  svgIcon?: string;
  disabled?: boolean;
  sub?: IChildItem[];
  badges?: IBadge[];
}

interface IChildItem {
  type?: string;
  name: string;
  state?: string;
  icon?: string;
  svgIcon?: string;
  sub?: IChildItem[];
}

interface IBadge {
  color: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private readonly applicationMenu: IMenuItem[] = [
    {
      type: 'separator',
      name: 'GTH'
    },
    {
      name: 'Pessoas',
      type: 'link',
      icon: 'people',
      state: 'pessoas'
    }
  ];

  iconMenu: IMenuItem[] = this.applicationMenu;
  separatorMenu: IMenuItem[] = this.applicationMenu;
  plainMenu: IMenuItem[] = this.applicationMenu;

  iconTypeMenuTitle = '';
  menuItems = new BehaviorSubject<IMenuItem[]>(this.applicationMenu);
  menuItems$ = this.menuItems.asObservable();

  publishNavigationChange(_menuType: string) {
    this.menuItems.next(this.applicationMenu);
  }
}
