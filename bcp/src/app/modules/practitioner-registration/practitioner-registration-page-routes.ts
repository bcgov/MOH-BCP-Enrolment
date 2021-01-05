import { PRACTITIONER_REGISTRATION_PAGES } from './practitioner-registration-route-constants';
import { PractitionerInfoComponent } from './pages/practitioner-info/practitioner-info.component';

import { Route } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FacilityInfoComponent } from './pages/facility-info/facility-info.component';
import { ReviewComponent } from './pages/review/review.component';
import { PractitionerAttachmentComponent } from './pages/practitioner-attachment/practitioner-attachment.component';

/** The individual page routes only, does not include container */
export const pages: Route[] = [
  {
    path: PRACTITIONER_REGISTRATION_PAGES.HOME.path,
    component: HomeComponent,
    data: {title: PRACTITIONER_REGISTRATION_PAGES.HOME.title}
  },
  {
    path: PRACTITIONER_REGISTRATION_PAGES.PRACTITIONER_INFO.path,
    component: PractitionerInfoComponent,
    data: {title: PRACTITIONER_REGISTRATION_PAGES.PRACTITIONER_INFO.title}
  },
  {
    path: PRACTITIONER_REGISTRATION_PAGES.FACILITY_INFO.path,
    component: FacilityInfoComponent,
    data: {title: PRACTITIONER_REGISTRATION_PAGES.FACILITY_INFO.title}
  },
  {
    path: PRACTITIONER_REGISTRATION_PAGES.PRACTITIONER_ASSIGN.path,
    component: PractitionerAttachmentComponent,
    data: {title: PRACTITIONER_REGISTRATION_PAGES.PRACTITIONER_ASSIGN.title}
  },
  {
    path: PRACTITIONER_REGISTRATION_PAGES.REVIEW.path,
    component: ReviewComponent,
    data: {title: PRACTITIONER_REGISTRATION_PAGES.REVIEW.title}
  },
  {
    path: '',
    redirectTo: PRACTITIONER_REGISTRATION_PAGES.HOME.path,
    pathMatch: 'full'
  }
];
