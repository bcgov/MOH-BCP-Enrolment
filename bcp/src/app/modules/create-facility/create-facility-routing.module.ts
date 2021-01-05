import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateFacilityContainerComponent } from './components/create-facility-container/create-facility-container.component';
import { createFacilityPageRoutes } from './create-facility-page-routing';
import { CREATE_FACILITY_PAGES } from './create-facility-route-constants';
import { SubmissionComponent } from './pages/submission/submission.component';
import { LoadPageGuardService } from 'moh-common-lib';

/** The top-level routes, including container, we pass to Angular  */
export const createFacilityRoutes: Routes = [
  {
    path: '',
    component: CreateFacilityContainerComponent,
    children: createFacilityPageRoutes,
    canActivateChild: [LoadPageGuardService]
  },
  {
    path: CREATE_FACILITY_PAGES.SUBMISSION.path,
    component: SubmissionComponent,
    data: {title: CREATE_FACILITY_PAGES.SUBMISSION.title}
  },
];

@NgModule({
  imports: [RouterModule.forChild(createFacilityRoutes)],
  exports: [RouterModule]
})
export class CreateFacilityRoutingModule { }
