import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UtilitiesRoutingModule } from './utilities-routing.module';
import { TypographyComponent } from './typography/typography.component';
import { SharedDirectivesModule } from 'app/shared/directives/shared-directives.module';
import { ColorsComponent } from './colors/colors.component';
import { commonMaterialModules, allMaterialModules } from 'app/shared/material-imports';

@NgModule({
  declarations: [TypographyComponent, ColorsComponent],
  imports: [
    CommonModule,
    ...commonMaterialModules,
    ...allMaterialModules,
    SharedDirectivesModule,
    UtilitiesRoutingModule
  ]
})
export class UtilitiesModule { }
