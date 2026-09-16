import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface IMenuItem {
  type: 'link' | 'dropDown' | 'icon' | 'separator' | 'extLink';
  name?: string; // Used as display text for item and title for separator type
  state?: string; // Router state
  icon?: string; // Material icon name
  svgIcon?: string; // UI Lib icon name
  disabled?: boolean; // If true, item will not be appeared in sidenav.
  sub?: IChildItem[]; // Dropdown items
  badges?: IBadge[];
}
interface IChildItem {
  type?: string;
  name: string; // Display text
  state?: string; // Router state
  icon?: string;  // Material icon name
  svgIcon?: string; // UI Lib icon name
  sub?: IChildItem[];
}

interface IBadge {
  color: string; // primary/accent/warn/hex color codes(#fff000)
  value: string; // Display text
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  iconMenu: IMenuItem[] = [
    {
      name: 'HOME',
      type: 'icon',
      icon: 'home',
      state: 'home'
    },
    {
      name: 'PROFILE',
      type: 'icon',
      icon: 'person',
      state: 'profile/overview'
    },
    {
      name: 'TOUR',
      type: 'icon',
      icon: 'flight_takeoff',
      state: 'tour'
    },
    {
      name: 'CHAT',
      type: 'icon',
      icon: 'chat',
      state: 'chat',
    },
    {
      type: 'separator',
      name: 'Main Items'
    },
    {
      name: 'DASHBOARD',
      type: 'dropDown',
      icon: 'dashboard',
      sub: [
        { name: 'Analytics', state: 'dashboard/analytics' },
        { name: 'Learning Management', state: 'dashboard/learning-management' },
        { name: 'Analytics Alt', state: 'dashboard/analytics-alt' },
        { name: 'Cryptocurrency', state: 'dashboard/crypto' },
      ]
    },
    {
      name: 'Data Table',
      type: 'dropDown',
      icon: 'list',
      sub: [
        {name: 'Basic Table', state: 'tables/mat-table'},
        {name: 'CRUD Table', state: 'cruds/ngx-table'},
        {name: 'Table variations', state: 'material/table'}
      ]
    },
    {
      name: 'CHAT',
      type: 'link',
      icon: 'chat',
      state: 'chat',
      badges: [{ color: 'warn', value: '1' }]
    },
    {
      name: 'Invoice',
      type: 'dropDown',
      icon: 'receipt',
      sub: [
        { name: 'List', state: 'invoice/list' },
        { name: 'View / Edit / Print', state: 'invoice/5a9ae2106518248b68251fd1' },
      ]
    },
    {
      name: 'ECOMMERCE',
      type: 'dropDown',
      icon: 'shopping_cart',
      sub: [
        { name: 'PRODUCTS', state: 'shop' },
        { name: 'PRODUCT DETAILS', state: 'shop/products/5a9ae2106f155194e5c95d67' },
        { name: 'CART', state: 'shop/cart' },
        { name: 'CHECKOUT', state: 'shop/checkout' }
      ]
    },
    {
      name: 'INBOX',
      type: 'link',
      icon: 'inbox',
      state: 'inbox',
      badges: [{ color: 'primary', value: '4' }]
    },
    {
      name: 'CALENDAR',
      type: 'link',
      icon: 'date_range',
      state: 'calendar'
    },
    {
      name: 'Todo',
      type: 'link',
      icon: 'center_focus_strong',
      state: 'todo/list'
    },
    {
      name: 'DIALOGS',
      type: 'dropDown',
      icon: 'filter_none',
      sub: [
        { name: 'CONFIRM', state: 'dialogs/confirm' },
        { name: 'LOADER', state: 'dialogs/loader' }
      ]
    },
    {
      name: 'Material Kits',
      type: 'dropDown',
      icon: 'favorite',
      badges: [{ color: 'primary', value: '60+' }],
      sub: [
        {
          name: 'Form controls',
          type: 'dropDown',
          sub: [
            { name: 'Autocomplete', state: 'material/autocomplete' },
            { name: 'Checkbox', state: 'material/checkbox' },
            { name: 'Datepicker', state: 'material/datepicker' },
            { name: 'Form Field', state: 'material/form-field' },
            { name: 'Input Field', state: 'material/input-field' },
            { name: 'Radio Button', state: 'material/radio-button' },
            { name: 'Select', state: 'material/select' },
            { name: 'Slider', state: 'material/slider' },
            { name: 'Slider Toggle', state: 'material/slider-toggle' }
          ]
        },
        {
          name: 'Navigation',
          type: 'dropDown',
          sub: [
            { name: 'Menu', state: 'material/menu' },
            { name: 'Sidenav', state: 'material/sidenav' },
            { name: 'Toolbar', state: 'material/toolbar' }
          ]
        },
        {
          name: 'Layout',
          type: 'dropDown',
          sub: [
            { name: 'Card', state: 'material/card' },
            { name: 'Divider', state: 'material/divider' },
            { name: 'Expansion Panel', state: 'material/expansion-panel' },
            { name: 'Grid', state: 'material/grid' },
            { name: 'List', state: 'material/list' },
            { name: 'Stepper', state: 'material/stepper' },
            { name: 'Tab', state: 'material/tab-group' },
            { name: 'Tree', state: 'material/tree' }
          ]
        },
        {
          name: 'Buttons & Indicators',
          type: 'dropDown',
          sub: [
            { name: 'BUTTONS', state: 'material/buttons' },
            { name: 'Button Toggle', state: 'material/button-toggle' },
            { name: 'Badge', state: 'material/badge' },
            { name: 'Chips', state: 'material/chips' },
            { name: 'Icons', state: 'material/icons' },
            { name: 'Progress Spinner', state: 'material/progress-spinner' },
            { name: 'Progress Bar', state: 'material/progress-bar' },
            { name: 'Ripples', state: 'material/ripples' }
          ]
        },
        {
          name: 'Popups & Modals',
          type: 'dropDown',
          sub: [
            { name: 'Tooltip', state: 'material/tooltip' },
            { name: 'Bottom Sheet', state: 'material/bottom-sheet' },
            { name: 'Dialog', state: 'material/dialog' },
            { name: 'Snackbar', state: 'material/snackbar' }
          ]
        },
        {
          name: 'Data Table',
          type: 'dropDown',
          sub: [
            { name: 'paginator', state: 'material/paginator' },
            { name: 'Sort Header', state: 'material/sort-header' },
            { name: 'Table', state: 'material/table' }
          ]
        }        
      ]
    },
    {
      name: 'FORMS',
      type: 'dropDown',
      icon: 'description',
      sub: [
        { name: 'BASIC', state: 'forms/basic' },
        { name: 'EDITOR', state: 'forms/editor' },
        { name: 'WIZARD', state: 'forms/wizard' }
      ]
    },
    {
      name: 'PROFILE',
      type: 'dropDown',
      icon: 'person',
      badges: [{ color: 'primary', value: '2' }],
      sub: [
        { name: 'OVERVIEW', state: 'profile/overview' },
        { name: 'SETTINGS', state: 'profile/settings' },
        { name: 'BLANK', state: 'profile/blank' }
      ]
    },
    {
      name: 'TOUR',
      type: 'link',
      icon: 'flight_takeoff',
      state: 'tour'
    },
    // {
    //   name: 'MAP',
    //   type: 'link',
    //   tooltip: 'Map',
    //   icon: 'add_location',
    //   state: 'map'
    // },

    {
      name: 'CHARTS',
      type: 'dropDown',
      icon: 'show_chart',
      sub: [
        { name: 'Chart js', state: 'charts' },
        {
          name: 'eChart',
          type: 'dropDown',
          state: 'chart',
          sub: [
            { name: 'Pie', state: 'chart/pie' },
            { name: 'Bar', state: 'chart/bar' },
            { name: 'Radar', state: 'chart/radar' },
            { name: "Heatmap", state: "chart/heatmap" },
          ]
        }
      ]
    },
    {
      name: 'Page Layouts',
      type: 'dropDown',
      icon: 'view_carousel',
      sub: [
        { name: 'Left sidebar card', state: 'page-layouts/left-sidebar-card' },
        { name: 'Right sidebar card', state: 'page-layouts/right-sidebar-card' },
        { name: 'Full width card', state: 'page-layouts/full-width-card' },
        { name: 'Full width card tab', state: 'page-layouts/full-width-card-tab' },
      ]
    },
    {
      name: 'SESSIONS',
      type: 'dropDown',
      icon: 'view_carousel',
      sub: [
        { name: 'SIGNIN', state: 'session-pages/signin' },
        { name: 'SIGNUP', state: 'session-pages/signup' },
        { name: 'FORGOT', state: 'session-pages/forgot-password' },
        { name: 'LOCKSCREEN', state: 'session-pages/lockscreen' },
        { name: 'NOTFOUND', state: 'session-pages/404' },
        { name: 'ERROR', state: 'session-pages/error' },
        { name: 'Signin 2', state: 'session-pages/signin2' },
        { name: 'Signup 2', state: 'session-pages/signup2' },
        { name: 'Signup 3', state: 'session-pages/signup3' },
        { name: 'Signin 3', state: 'session-pages/signin3' },
      ]
    },
    {
      name: 'Utilities',
      type: 'dropDown',
      icon: 'format_list_bulleted',
      sub: [
        { name: 'Color', state: 'utilities/color' },
        { name: 'Typography', state: 'utilities/typography' }
      ]
    },
    {
      name: 'OTHERS',
      type: 'dropDown',
      icon: 'blur_on',
      sub: [
        { name: 'GALLERY', state: 'others/gallery' },
        { name: 'PRICINGS', state: 'others/pricing' },
        { name: 'USERS', state: 'others/users' },
        { name: 'BLANK', state: 'others/blank' }
      ]
    },
    {
      name: 'MATICONS',
      type: 'link',
      icon: 'store',
      state: 'icons'
    },
    {
      name: 'Multi Level',
      type: 'dropDown',
      icon: 'format_align_center',
      sub: [
        { name: 'Level Two', state: 'fake-4' },
        {
          name: 'Level Two',
          type: 'dropDown',
          sub: [
            { name: 'Level Three', state: 'fake-2' },
            { 
              name: 'Level Three', 
              type: 'dropDown',
              sub: [
                { name: 'Level Four', state: 'fake-3' },
                { 
                  name: 'Level Four', 
                  type: 'dropDown',
                  sub: [
                    { name: 'Level Five', state: 'fake-3' },
                    { name: 'Level Five', type: 'link', state: 'fake-3' }
                  ]
                }
              ]
            }
          ]
        },
        { name: 'Level Two', state: 'fake-5' }
      ]
    },
    {
      name: 'DOC',
      type: 'extLink',
      icon: 'library_books',
      state: 'http://demos.ui-lib.com/egret-doc/'
    }
  ];

  separatorMenu: IMenuItem[] = [
    {
      type: 'separator',
      name: 'CUSTOM COMPONENTS'
    },
    {
      name: 'DASHBOARD',
      type: 'dropDown',
      icon: 'dashboard',
      sub: [
        { name: 'Analytics', state: 'dashboard/analytics' },
        { name: 'Learning Management', state: 'dashboard/learning-management' },
        { name: 'Analytics Alt', state: 'dashboard/analytics-alt' },
        { name: 'Cryptocurrency', state: 'dashboard/crypto' },
      ]
    },
    {
      name: 'CRUD Table',
      type: 'link',
      icon: 'list',
      state: 'cruds/ngx-table'
    },
    {
      name: 'ECOMMERCE',
      type: 'dropDown',
      icon: 'shopping_cart',
      sub: [
        { name: 'PRODUCTS', state: 'shop' },
        { name: 'PRODUCT DETAILS', state: 'shop/products/5a9ae2106f155194e5c95d67' },
        { name: 'CART', state: 'shop/cart' },
        { name: 'CHECKOUT', state: 'shop/checkout' }
      ]
    },
    {
      name: 'INBOX',
      type: 'link',
      icon: 'inbox',
      state: 'inbox',
      badges: [{ color: 'primary', value: '4' }]
    },
    {
      name: 'Invoice',
      type: 'dropDown',
      icon: 'receipt',
      sub: [
        { name: 'List', state: 'invoice/list' },
        { name: 'View / Edit', state: 'invoice/5a9ae2106518248b68251fd1' },
      ]
    },
    {
      name: 'PROFILE',
      type: 'dropDown',
      icon: 'person',
      badges: [{ color: 'primary', value: '2' }],
      sub: [
        { name: 'OVERVIEW', state: 'profile/overview' },
        { name: 'SETTINGS', state: 'profile/settings' },
        { name: 'BLANK', state: 'profile/blank' }
      ]
    },
    {
      name: 'CHAT',
      type: 'link',
      icon: 'chat',
      state: 'chat',
      badges: [{ color: 'warn', value: '1' }]
    },
    {
      name: 'Todo',
      type: 'link',
      icon: 'center_focus_strong',
      state: 'todo/list'
    },
    {
      name: 'DIALOGS',
      type: 'dropDown',
      icon: 'filter_none',
      sub: [
        { name: 'CONFIRM', state: 'dialogs/confirm' },
        { name: 'LOADER', state: 'dialogs/loader' }
      ]
    },
    {
      type: 'separator',
      name: 'INTEGRATED COMPONENTS'
    },
    {
      name: 'Material Kits',
      type: 'dropDown',
      icon: 'favorite',
      badges: [{ color: 'primary', value: '60+' }],
      sub: [
        {
          name: 'Form controls',
          type: 'dropDown',
          sub: [
            { name: 'Autocomplete', state: 'material/autocomplete' },
            { name: 'Checkbox', state: 'material/checkbox' },
            { name: 'Datepicker', state: 'material/datepicker' },
            { name: 'Form Field', state: 'material/form-field' },
            { name: 'Input Field', state: 'material/input-field' },
            { name: 'Radio Button', state: 'material/radio-button' },
            { name: 'Select', state: 'material/select' },
            { name: 'Slider', state: 'material/slider' },
            { name: 'Slider Toggle', state: 'material/slider-toggle' }
          ]
        },
        {
          name: 'Navigation',
          type: 'dropDown',
          sub: [
            { name: 'Menu', state: 'material/menu' },
            { name: 'Sidenav', state: 'material/sidenav' },
            { name: 'Toolbar', state: 'material/toolbar' }
          ]
        },
        {
          name: 'Layout',
          type: 'dropDown',
          sub: [
            { name: 'Card', state: 'material/card' },
            { name: 'Divider', state: 'material/divider' },
            { name: 'Expansion Panel', state: 'material/expansion-panel' },
            { name: 'Grid', state: 'material/grid' },
            { name: 'List', state: 'material/list' },
            { name: 'Stepper', state: 'material/stepper' },
            { name: 'Tab', state: 'material/tab-group' },
            { name: 'Tree', state: 'material/tree' }
          ]
        },
        {
          name: 'Buttons & Indicators',
          type: 'dropDown',
          sub: [
            { name: 'BUTTONS', state: 'material/buttons' },
            { name: 'Button Toggle', state: 'material/button-toggle' },
            { name: 'Badge', state: 'material/badge' },
            { name: 'Chips', state: 'material/chips' },
            { name: 'Icons', state: 'material/icons' },
            { name: 'Progress Spinner', state: 'material/progress-spinner' },
            { name: 'Progress Bar', state: 'material/progress-bar' },
            { name: 'Ripples', state: 'material/ripples' }
          ]
        },
        {
          name: 'Popups & Modals',
          type: 'dropDown',
          sub: [
            { name: 'Tooltip', state: 'material/tooltip' },
            { name: 'Bottom Sheet', state: 'material/bottom-sheet' },
            { name: 'Dialog', state: 'material/dialog' },
            { name: 'Snackbar', state: 'material/snackbar' }
          ]
        },
        {
          name: 'Data Table',
          type: 'dropDown',
          sub: [
            { name: 'paginator', state: 'material/paginator' },
            { name: 'Sort Header', state: 'material/sort-header' },
            { name: 'Table', state: 'material/table' }
          ]
        },
      ]
    },
    {
      name: 'CALENDAR',
      type: 'link',
      icon: 'date_range',
      state: 'calendar'
    },
    {
      name: 'FORMS',
      type: 'dropDown',
      icon: 'description',
      sub: [
        { name: 'BASIC', state: 'forms/basic' },
        { name: 'EDITOR', state: 'forms/editor' },
        { name: 'WIZARD', state: 'forms/wizard' }
      ]
    },
    {
      name: 'Table',
      type: 'link',
      icon: 'format_line_spacing',
      state: 'tables/mat-table',
    },
    {
      name: 'TOUR',
      type: 'link',
      icon: 'flight_takeoff',
      state: 'tour'
    },
    // {
    //   name: 'MAP',
    //   type: 'link',
    //   tooltip: 'Map',
    //   icon: 'add_location',
    //   state: 'map'
    // },

    {
      name: 'CHARTS',
      type: 'dropDown',
      icon: 'show_chart',
      sub: [
        { name: 'Chart js', state: 'charts' },
        {
          name: 'eChart',
          type: 'dropDown',
          state: 'chart',
          sub: [
            { name: 'Pie', state: 'chart/pie' },
            { name: 'Bar', state: 'chart/bar' },
            { name: 'Radar', state: 'chart/radar' },
            { name: "Heatmap", state: "chart/heatmap" },
          ]
        }
      ]
    },
    {
      name: 'OTHER COMPONENTS',
      type: 'separator',
    },
    {
      name: 'Page Layouts',
      type: 'dropDown',
      icon: 'view_carousel',
      sub: [
        { name: 'Left sidebar card', state: 'page-layouts/left-sidebar-card' },
        { name: 'Right sidebar card', state: 'page-layouts/right-sidebar-card' },
        { name: 'Full width card', state: 'page-layouts/full-width-card' },
        { name: 'Full width card tab', state: 'page-layouts/full-width-card-tab' },
      ]
    },
    {
      name: 'SESSIONS',
      type: 'dropDown',
      icon: 'view_carousel',
      sub: [
        { name: 'SIGNUP', state: 'session-pages/signup' },
        { name: 'Signup 2', state: 'session-pages/signup2' },
        { name: 'Signup 3', state: 'session-pages/signup3' },
        { name: 'SIGNIN', state: 'session-pages/signin' },
        { name: 'Signin 2', state: 'session-pages/signin2' },
        { name: 'Signin 3', state: 'session-pages/signin3' },
        { name: 'FORGOT', state: 'session-pages/forgot-password' },
        { name: 'LOCKSCREEN', state: 'session-pages/lockscreen' },
        { name: 'NOTFOUND', state: 'session-pages/404' },
        { name: 'ERROR', state: 'session-pages/error' }
      ]
    },
    {
      name: 'Utilities',
      type: 'dropDown',
      icon: 'format_list_bulleted',
      sub: [
        { name: 'Color', state: 'utilities/color' },
        { name: 'Typography', state: 'utilities/typography' }
      ]
    },
    {
      name: 'OTHERS',
      type: 'dropDown',
      icon: 'blur_on',
      sub: [
        { name: 'GALLERY', state: 'others/gallery' },
        { name: 'PRICINGS', state: 'others/pricing' },
        { name: 'USERS', state: 'others/users' },
        { name: 'BLANK', state: 'others/blank' }
      ]
    },
    {
      name: 'MATICONS',
      type: 'link',
      icon: 'store',
      state: 'icons'
    },
    {
      name: 'Multi Level',
      type: 'dropDown',
      icon: 'format_align_center',
      sub: [
        { name: 'Level Two', state: 'fake-4' },
        {
          name: 'Level Two',
          type: 'dropDown',
          state: 'fake-1',
          sub: [
            { name: 'Level Three', state: 'fake-2' },
            { 
              name: 'Level Three', 
              type: 'dropDown',
              state: 'fake-3',
              sub: [
                { name: 'Level Four', state: 'fake-3' },
                { 
                  name: 'Level Four', 
                  type: 'dropDown',
                  state: 'fake-4',
                  sub: [
                    { name: 'Level Five', state: 'fake-3' },
                    { name: 'Level Five', type: 'link' }
                  ]
                }
              ]
            }
          ]
        },
        { name: 'Level Two', state: 'fake-5' }
      ]
    },
    {
      name: 'DOC',
      type: 'extLink',
      icon: 'library_books',
      state: 'http://demos.ui-lib.com/egret-doc/'
    }
  ];

  plainMenu: IMenuItem[] = [
    {
      name: 'DASHBOARD',
      type: 'dropDown',
      icon: 'dashboard',
      sub: [
        { name: 'Analytics', state: 'dashboard/analytics' },
        { name: 'Learning Management', state: 'dashboard/learning-management' },
        { name: 'Analytics Alt', state: 'dashboard/analytics-alt' },
        { name: 'Cryptocurrency', state: 'dashboard/crypto' },
      ]
    },
    {
      name: 'CRUD Table',
      type: 'link',
      icon: 'list',
      state: 'cruds/ngx-table'
    },
    {
      name: 'ECOMMERCE',
      type: 'dropDown',
      icon: 'shopping_cart',
      sub: [
        { name: 'PRODUCTS', state: 'shop' },
        { name: 'PRODUCT DETAILS', state: 'shop/products/5a9ae2106f155194e5c95d67' },
        { name: 'CART', state: 'shop/cart' },
        { name: 'CHECKOUT', state: 'shop/checkout' }
      ]
    },
    {
      name: 'INBOX',
      type: 'link',
      icon: 'inbox',
      state: 'inbox',
      badges: [{ color: 'primary', value: '4' }]
    },
    {
      name: 'Invoice',
      type: 'dropDown',
      icon: 'receipt',
      sub: [
        { name: 'List', state: 'invoice/list' },
        { name: 'View / Edit', state: 'invoice/5a9ae2106518248b68251fd1' },
      ]
    },
    {
      name: 'CHAT',
      type: 'link',
      icon: 'chat',
      state: 'chat',
      badges: [{ color: 'warn', value: '1' }]
    },
    {
      name: 'CALENDAR',
      type: 'link',
      icon: 'date_range',
      state: 'calendar'
    },
    {
      name: 'Todo',
      type: 'link',
      icon: 'center_focus_strong',
      state: 'todo/list'
    },
    {
      name: 'DIALOGS',
      type: 'dropDown',
      icon: 'filter_none',
      sub: [
        { name: 'CONFIRM', state: 'dialogs/confirm' },
        { name: 'LOADER', state: 'dialogs/loader' }
      ]
    },
    {
      name: 'Material Kits',
      type: 'dropDown',
      icon: 'favorite',
      badges: [{ color: 'primary', value: '60+' }],
      sub: [
        {
          name: 'Form controls',
          type: 'dropDown',
          sub: [
            { name: 'Autocomplete', state: 'material/autocomplete' },
            { name: 'Checkbox', state: 'material/checkbox' },
            { name: 'Datepicker', state: 'material/datepicker' },
            { name: 'Form Field', state: 'material/form-field' },
            { name: 'Input Field', state: 'material/input-field' },
            { name: 'Radio Button', state: 'material/radio-button' },
            { name: 'Select', state: 'material/select' },
            { name: 'Slider', state: 'material/slider' },
            { name: 'Slider Toggle', state: 'material/slider-toggle' }
          ]
        },
        {
          name: 'Navigation',
          type: 'dropDown',
          sub: [
            { name: 'Menu', state: 'material/menu' },
            { name: 'Sidenav', state: 'material/sidenav' },
            { name: 'Toolbar', state: 'material/toolbar' }
          ]
        },
        {
          name: 'Layout',
          type: 'dropDown',
          sub: [
            { name: 'Card', state: 'material/card' },
            { name: 'Divider', state: 'material/divider' },
            { name: 'Expansion Panel', state: 'material/expansion-panel' },
            { name: 'Grid', state: 'material/grid' },
            { name: 'List', state: 'material/list' },
            { name: 'Stepper', state: 'material/stepper' },
            { name: 'Tab', state: 'material/tab-group' },
            { name: 'Tree', state: 'material/tree' }
          ]
        },
        {
          name: 'Buttons & Indicators',
          type: 'dropDown',
          sub: [
            { name: 'BUTTONS', state: 'material/buttons' },
            { name: 'Button Toggle', state: 'material/button-toggle' },
            { name: 'Badge', state: 'material/badge' },
            { name: 'Chips', state: 'material/chips' },
            { name: 'Icons', state: 'material/icons' },
            { name: 'Progress Spinner', state: 'material/progress-spinner' },
            { name: 'Progress Bar', state: 'material/progress-bar' },
            { name: 'Ripples', state: 'material/ripples' }
          ]
        },
        {
          name: 'Popups & Modals',
          type: 'dropDown',
          sub: [
            { name: 'Tooltip', state: 'material/tooltip' },
            { name: 'Bottom Sheet', state: 'material/bottom-sheet' },
            { name: 'Dialog', state: 'material/dialog' },
            { name: 'Snackbar', state: 'material/snackbar' }
          ]
        },
        {
          name: 'Data Table',
          type: 'dropDown',
          sub: [
            { name: 'paginator', state: 'material/paginator' },
            { name: 'Sort Header', state: 'material/sort-header' },
            { name: 'Table', state: 'material/table' }
          ]
        }
      ]
    },
    {
      name: 'FORMS',
      type: 'dropDown',
      icon: 'description',
      sub: [
        { name: 'BASIC', state: 'forms/basic' },
        { name: 'EDITOR', state: 'forms/editor' },
        { name: 'WIZARD', state: 'forms/wizard' }
      ]
    },
    {
      name: 'Table',
      type: 'link',
      icon: 'format_line_spacing',
      state: 'tables/mat-table',
    },
    {
      name: 'PROFILE',
      type: 'dropDown',
      icon: 'person',
      badges: [{ color: 'primary', value: '2' }],
      sub: [
        { name: 'OVERVIEW', state: 'profile/overview' },
        { name: 'SETTINGS', state: 'profile/settings' },
        { name: 'BLANK', state: 'profile/blank' }
      ]
    },
    {
      name: 'TOUR',
      type: 'link',
      icon: 'flight_takeoff',
      state: 'tour'
    },
    // {
    //   name: 'MAP',
    //   type: 'link',
    //   tooltip: 'Map',
    //   icon: 'add_location',
    //   state: 'map'
    // },

    {
      name: 'CHARTS',
      type: 'dropDown',
      icon: 'show_chart',
      sub: [
        { name: 'Chart js', state: 'charts' },
        {
          name: 'eChart',
          type: 'dropDown',
          state: 'chart',
          sub: [
            { name: 'Pie', state: 'chart/pie' },
            { name: 'Bar', state: 'chart/bar' },
            { name: 'Radar', state: 'chart/radar' },
            { name: "Heatmap", state: "chart/heatmap" },
          ]
        }
      ]
    },
    {
      name: 'Page Layouts',
      type: 'dropDown',
      icon: 'view_carousel',
      sub: [
        { name: 'Left sidebar card', state: 'page-layouts/left-sidebar-card' },
        { name: 'Right sidebar card', state: 'page-layouts/right-sidebar-card' },
        { name: 'Full width card', state: 'page-layouts/full-width-card' },
        { name: 'Full width card tab', state: 'page-layouts/full-width-card-tab' },
      ]
    },
    {
      name: 'SESSIONS',
      type: 'dropDown',
      icon: 'view_carousel',
      sub: [
        { name: 'SIGNUP', state: 'session-pages/signup' },
        { name: 'Signup 2', state: 'session-pages/signup2' },
        { name: 'Signup 3', state: 'session-pages/signup3' },
        { name: 'SIGNIN', state: 'session-pages/signin' },
        { name: 'Signin 2', state: 'session-pages/signin2' },
        { name: 'Signin 3', state: 'session-pages/signin3' },
        { name: 'FORGOT', state: 'session-pages/forgot-password' },
        { name: 'LOCKSCREEN', state: 'session-pages/lockscreen' },
        { name: 'NOTFOUND', state: 'session-pages/404' },
        { name: 'ERROR', state: 'session-pages/error' }
      ]
    },
    {
      name: 'Utilities',
      type: 'dropDown',
      icon: 'format_list_bulleted',
      sub: [
        { name: 'Color', state: 'utilities/color' },
        { name: 'Typography', state: 'utilities/typography' }
      ]
    },
    {
      name: 'OTHERS',
      type: 'dropDown',
      icon: 'blur_on',
      sub: [
        { name: 'GALLERY', state: 'others/gallery' },
        { name: 'PRICINGS', state: 'others/pricing' },
        { name: 'USERS', state: 'others/users' },
        { name: 'BLANK', state: 'others/blank' }
      ]
    },
    {
      name: 'MATICONS',
      type: 'link',
      icon: 'store',
      state: 'icons'
    },
    {
      name: 'Multi Level',
      type: 'dropDown',
      icon: 'format_align_center',
      sub: [
        { name: 'Level Two', state: 'fake-4' },
        {
          name: 'Level Two',
          type: 'dropDown',
          state: 'fake-1',
          sub: [
            { name: 'Level Three', state: 'fake-2' },
            { 
              name: 'Level Three', 
              type: 'dropDown',
              state: 'fake-3',
              sub: [
                { name: 'Level Four', state: 'fake-3' },
                { 
                  name: 'Level Four', 
                  type: 'dropDown',
                  state: 'fake-4',
                  sub: [
                    { name: 'Level Five', state: 'fake-3' },
                    { name: 'Level Five', type: 'link' }
                  ]
                }
              ]
            }
          ]
        },
        { name: 'Level Two', state: 'fake-5' }
      ]
    },
    {
      name: 'DOC',
      type: 'extLink',
      icon: 'library_books',
      state: 'http://demos.ui-lib.com/egret-doc/'
    }
  ];

  // Icon menu TITLE at the very top of navigation.
  // This title will appear if any icon type item is present in menu.
  iconTypeMenuTitle = 'Frequently Accessed';
  // sets iconMenu as default;
  menuItems = new BehaviorSubject<IMenuItem[]>(this.iconMenu);
  // navigation component has subscribed to this Observable
  menuItems$ = this.menuItems.asObservable();
  constructor() { }

  // Customizer component uses this method to change menu.
  // You can remove this method and customizer component.
  // Or you can customize this method to supply different menu for
  // different user type.
  publishNavigationChange(menuType: string) {
    switch (menuType) {
      case 'separator-menu':
        this.menuItems.next(this.separatorMenu);
        break;
      case 'icon-menu':
        this.menuItems.next(this.iconMenu);
        break;
      default:
        this.menuItems.next(this.plainMenu);
    }
  }
}
