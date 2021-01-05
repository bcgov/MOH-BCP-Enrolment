import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UPDATE_FACILITY_PAGES } from './update-facility-route-constants';
import { SubmissionComponent } from './pages/submission/submission.component';
import { FacilityContainerComponent } from './components/facility-container/facility-container.component';
import { pages } from './update-facility-page-routes';
import { LoadPageGuardService } from 'moh-common-lib';

const routes: Routes = [
  {
    path: '',
    component: FacilityContainerComponent,
    children: pages,
    canActivateChild: [LoadPageGuardService]
  },
  {
    path: UPDATE_FACILITY_PAGES.SUBMISSION.path,
    component: SubmissionComponent,
    data: {title: UPDATE_FACILITY_PAGES.SUBMISSION.title}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpdateFacilityRoutingModule { }
