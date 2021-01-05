import { UPDATE_FACILITY_PAGES } from './update-facility-route-constants';

import { Route } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FacilityAdminComponent } from './pages/facility-admin/facility-admin.component';
import { CancelChangeComponent } from './pages/cancel-change/cancel-change.component';
import { ReviewComponent } from './pages/review/review.component';

/** The individual page routes only, does not include container */
export const pages: Route[] = [
  {
    path: UPDATE_FACILITY_PAGES.HOME.path,
    component: HomeComponent,
    data: {title: UPDATE_FACILITY_PAGES.HOME.title}
  },
  {
    path: UPDATE_FACILITY_PAGES.FACILITY_ADMIN.path,
    component: FacilityAdminComponent,
    data: {title: UPDATE_FACILITY_PAGES.FACILITY_ADMIN.title}
  },
  {
    path: UPDATE_FACILITY_PAGES.CANCEL_CHANGE.path,
    component: CancelChangeComponent,
    data: {title: UPDATE_FACILITY_PAGES.CANCEL_CHANGE.title}
  },
  {
    path: UPDATE_FACILITY_PAGES.REVIEW.path,
    component: ReviewComponent,
    data: {title: UPDATE_FACILITY_PAGES.REVIEW.title}
  },
  {
    path: '',
    redirectTo: UPDATE_FACILITY_PAGES.HOME.path,
    pathMatch: 'full'
  }
];
