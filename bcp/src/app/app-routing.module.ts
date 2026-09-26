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
    loadChildren: () => import('./modules/create-facility/create-facility.module').then(m => m.CreateFacilityModule)
  },
  {
    path: BCP_ROUTES.UPDATE_FACILITY,
    loadChildren: () => import('./modules/update-facility/update-facility.module').then(m => m.UpdateFacilityModule)
  },
  {
    path: BCP_ROUTES.PRACTITIONER_REGISTRATION,
    loadChildren: () => import('./modules/practitioner-registration/practitioner-registration.module').then(m => m.PractitionerRegistrationModule)
  },
  {
    path: BCP_ROUTES.MAINTENANCE,
    loadChildren: () => import('./modules/splash-page/splash-page.module').then(m => m.SplashPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
