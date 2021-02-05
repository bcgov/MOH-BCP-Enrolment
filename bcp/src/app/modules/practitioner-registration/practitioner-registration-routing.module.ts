import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PRACTITIONER_REGISTRATION_PAGES } from './practitioner-registration-route-constants';
import { SubmissionComponent } from './pages/submission/submission.component';
import { RegistrationContainerComponent } from './components/registration-container/registration-container.component';
import { pages } from './practitioner-registration-page-routes';
import { LoadPageGuardService } from 'moh-common-lib';

const routes: Routes = [
  {
    path: '',
    component: RegistrationContainerComponent,
    children: pages,
    canActivateChild: [LoadPageGuardService]
  },
  {
    path: PRACTITIONER_REGISTRATION_PAGES.SUBMISSION.path,
    component: SubmissionComponent,
    data: {title: PRACTITIONER_REGISTRATION_PAGES.SUBMISSION.title}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PractitionerAssignmentRoutingModule { }
