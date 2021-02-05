import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedCoreModule } from 'moh-common-lib';
import { HttpClientModule } from '@angular/common/http';
import { LandingComponent } from './pages/landing/landing.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { fakeBackendProvider } from './_developmentHelpers/fake-backend';
import { environment } from '../environments/environment';

const providerList: any = [];

if ( environment.useMockBackend ) {
  // provider used to create fake backend - development of registration modules
  providerList.push( fakeBackendProvider );
}

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedCoreModule, // necessary here for CommonHeader at top level,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [providerList],
  bootstrap: [AppComponent]
})
export class AppModule { }
