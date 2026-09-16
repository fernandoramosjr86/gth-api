import { Component, OnInit, EventEmitter, Input, ViewChildren, Output, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { commonMaterialModules } from '../../material-imports';
import { ThemeService } from '../../services/theme.service';
import { LayoutService } from '../../services/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { JwtAuthService } from '../../services/auth/jwt-auth.service';
import { SearchModule } from '../../search/search.module';

@Component({
    selector: 'app-header-side',
    templateUrl: './header-side.template.html',
    standalone: true,
    imports: [
      CommonModule,
      RouterModule,
      ...commonMaterialModules,
      TranslateModule,
      SearchModule
    ]
})
export class HeaderSideComponent implements OnInit {
  @Input() notificPanel;
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

  public themes: any[] = [];
  public activeTheme: any;
  public layoutConf: any;
  constructor(
    private themeService: ThemeService,
    private layout: LayoutService,
    public translate: TranslateService,
    private renderer: Renderer2,
    public jwtAuth: JwtAuthService
  ) {}
  ngOnInit() {
    this.themes = this.themeService.getAvailableThemes();
    this.activeTheme = this.themeService.getActiveTheme();
    this.layoutConf = this.layout.layoutConf;
    this.translate.use(this.currentLang.code);
  }
  setLang(lng) {
    this.currentLang = lng;
    this.translate.use(lng.code);
  }
  changeTheme(themeId: string) {
    this.themeService.setActiveThemeById(themeId);
  }
  toggleNotific() {
    this.notificPanel.toggle();
  }
  toggleSidenav() {
    if (this.layoutConf.sidebarStyle === 'closed') {
      return this.layout.publishLayoutChange({
        sidebarStyle: 'full'
      });
    }
    this.layout.publishLayoutChange({
      sidebarStyle: 'closed'
    });
  }

  toggleCollapse() {
    // compact --> full
    if (this.layoutConf.sidebarStyle === 'compact') {
      return this.layout.publishLayoutChange({
        sidebarStyle: 'full',
        sidebarCompactToggle: false
      });
    }

    // * --> compact
    this.layout.publishLayoutChange({
      sidebarStyle: 'compact',
      sidebarCompactToggle: true
    });

  }

  onSearch(e) {
    //   console.log(e)
  }
}
