import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedCoreModule } from 'moh-common-lib';
import { SplashPageRoutingModule } from './splash-page-routing.module';
import { SplashPageComponent } from './page/splash-page/splash-page.component';

@NgModule({
  imports: [
    CommonModule,
    SharedCoreModule,
    SplashPageRoutingModule,
  ],
  declarations: [SplashPageComponent]
})
export class SplashPageModule { }
