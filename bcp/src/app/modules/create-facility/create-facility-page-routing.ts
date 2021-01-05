import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ApplicantInfoComponent } from './pages/applicant-info/applicant-info.component';
import { FacilityInfoComponent } from './pages/facility-info/facility-info.component';
import { ReviewComponent } from './pages/review/review.component';
import { CREATE_FACILITY_PAGES } from './create-facility-route-constants';




/** The individual page routes only, does not include container */
export const createFacilityPageRoutes: Routes = [
  {
    path: '',
    redirectTo: CREATE_FACILITY_PAGES.HOME.path,
    pathMatch: 'full'
  },
  {
    path: CREATE_FACILITY_PAGES.HOME.path,
    component: HomeComponent,
    data: {title: CREATE_FACILITY_PAGES.HOME.title}
  },
  {
    path: CREATE_FACILITY_PAGES.FACILITY_ADMIN.path,
    component: ApplicantInfoComponent,
    data: {title: CREATE_FACILITY_PAGES.FACILITY_ADMIN.title}
  },
  {
    path: CREATE_FACILITY_PAGES.FACILITY_INFO.path,
    component: FacilityInfoComponent,
    data: {title: CREATE_FACILITY_PAGES.FACILITY_INFO.title}
  },
  {
    path: CREATE_FACILITY_PAGES.REVIEW.path,
    component: ReviewComponent,
    data: {title: CREATE_FACILITY_PAGES.REVIEW.title}
  },
];
