import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, NavigationStart, Router, RouterModule } from '@angular/router';
import { Subscription } from "rxjs";
import { LayoutService } from '../../../services/layout.service';
import { JwtAuthService } from '../../../services/auth/jwt-auth.service';
import { CustomizerComponent } from '../../customizer/customizer.component';
import { HorizontalLayoutComponent } from '../horizontal-layout/horizontal-layout.component';
import { VerticalLayoutComponent } from '../vertical-layout/vertical-layout.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
    selector: 'app-admin-layout',
    templateUrl: './admin-layout.component.html',
    standalone: true,
    imports: [
      CommonModule,
      RouterModule,
      HorizontalLayoutComponent,
      VerticalLayoutComponent,
      CustomizerComponent,
      MatProgressBarModule
    ]
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  private layoutConfSub: Subscription;
  private moduleLoaderSub: Subscription;
  public layoutConf: any = {};
  public isModuleLoading: Boolean = false;
  
  constructor(
    private layout: LayoutService,
    private router: Router,
    private jwtAuth: JwtAuthService
  ) {
    // Check Auth Token is valid
    this.jwtAuth.checkTokenIsValid().subscribe();
  }

  ngOnInit() {
    this.layoutConfSub = this.layout.layoutConf$.subscribe((layoutConf) => {
      this.layoutConf = layoutConf;
    });
     // FOR MODULE LOADER FLAG
     this.moduleLoaderSub = this.router.events.subscribe(event => {
      if(event instanceof NavigationStart) {
        this.isModuleLoading = true;
        console.log('NavigationStart');
      }
      if(event instanceof NavigationEnd) {
        this.isModuleLoading = false;
        console.log('NavigationEnd');
      }
    });
  }
  
  ngOnDestroy() {
    if(this.layoutConfSub) {
      this.layoutConfSub.unsubscribe();
    }
  }
}
