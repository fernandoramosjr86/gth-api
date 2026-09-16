import { Component, OnInit, Input, OnDestroy, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationService } from "../../../shared/services/navigation.service";
import { Subscription } from 'rxjs';
import { ThemeService } from '../../../shared/services/theme.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutService } from '../../services/layout.service';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';
import { commonMaterialModules } from 'app/shared/material-imports';

@Component({
    selector: 'app-header-top',
    templateUrl: './header-top.component.html',
    standalone: true,
    imports: [
      CommonModule,
      RouterModule,
      ...commonMaterialModules,
      TranslateModule
    ]
})
export class HeaderTopComponent implements OnInit, OnDestroy {
  layoutConf: any;
  menuItems:any;
  menuItemSub: Subscription;
  themes: any[] = [];
  activeTheme: any;
  public availableLangs = [{
    name: 'EN',
    code: 'en',
    flag: 'us'
  }, {
    name: 'ES',
    code: 'es',
    flag: 'es'
  }];
  currentLang = this.availableLangs[0];

  @Input() notificPanel;
  constructor(
    private layout: LayoutService,
    private navService: NavigationService,
    public themeService: ThemeService,
    public translate: TranslateService,
    private renderer: Renderer2,
    public jwtAuth: JwtAuthService
  ) { }

  ngOnInit() {
    this.layoutConf = this.layout.layoutConf;
    this.themes = this.themeService.getAvailableThemes();
    this.activeTheme = this.themeService.getActiveTheme();
    this.translate.use(this.currentLang.code);
    this.menuItemSub = this.navService.menuItems$
    .subscribe(res => {
      res = res.filter(item => item.type !== 'icon' && item.type !== 'separator');
      let limit = 4
      let mainItems:any[] = res.slice(0, limit)
      if(res.length <= limit) {
        return this.menuItems = mainItems
      }
      let subItems:any[] = res.slice(limit, res.length - 1)
      mainItems.push({
        name: 'More',
        type: 'dropDown',
        tooltip: 'More',
        icon: 'more_horiz',
        sub: subItems
      })
      this.menuItems = mainItems
    })
  }
  ngOnDestroy() {
    this.menuItemSub.unsubscribe()
  }
  setLang(lng) {
    this.currentLang = lng;
    this.translate.use(lng.code);
  }
  changeTheme(theme: any) {
    this.themeService.setActiveThemeById(theme.id);
    this.layout.publishLayoutChange({matTheme: theme.id});
  }
  toggleNotific() {
    this.notificPanel.toggle();
  }
  toggleSidenav() {
    if(this.layoutConf.sidebarStyle === 'closed') {
      return this.layout.publishLayoutChange({
        sidebarStyle: 'full'
      })
    }
    this.layout.publishLayoutChange({
      sidebarStyle: 'closed'
    })
  }
}
