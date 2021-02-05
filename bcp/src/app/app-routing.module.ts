import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { BCP_ROUTES } from './modules/core-bcp/models/bcp-route-constanst';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    data: {title: 'Landing Page'}
  },
  {
    path: BCP_ROUTES.CREATE_FACILITY,
    loadChildren: './modules/create-facility/create-facility.module#CreateFacilityModule'
  },
  {
    path: BCP_ROUTES.UPDATE_FACILITY,
    loadChildren: './modules/update-facility/update-facility.module#UpdateFacilityModule'
  },
  {
    path: BCP_ROUTES.PRACTITIONER_REGISTRATION,
    loadChildren: './modules/practitioner-registration/practitioner-registration.module#PractitionerRegistrationModule'
  },
  {
    path: BCP_ROUTES.MAINTENANCE,
    loadChildren: './modules/splash-page/splash-page.module#SplashPageModule'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
