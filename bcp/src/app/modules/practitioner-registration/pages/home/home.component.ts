import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConsentModalComponent, PageStateService } from 'moh-common-lib';
import { UUID } from 'angular2-uuid';
import { PRACTITIONER_REGISTRATION_PAGES } from '../../practitioner-registration-route-constants';
import { ContainerService } from 'moh-common-lib';
import { RegisterPractitionerDataService } from '../../services/register-practitioner-data.service';
import { environment } from '../../../../../environments/environment';
import { BcpBaseForm } from '../../../core-bcp/models/bcp-base-form';
import { RegisterPractitionerApiService } from '../../services/register-practitioner-api.service';

@Component({
  selector: 'bcp-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends BcpBaseForm implements OnInit {

  @ViewChild('bcpConsentModal', { static: true }) bcpConsentModal: ConsentModalComponent;
  nonce: string = UUID.UUID();
  captchaApiBaseUrl = environment.api.captcha;
  recaptchaApiBaseUrl = environment.api.recaptcha;
  initialModalVisibility: boolean = false;

  constructor( protected containerService: ContainerService,
               protected router: Router,
               protected pageStateService: PageStateService,
               private apiService: RegisterPractitionerApiService,
               private dataService: RegisterPractitionerDataService ) {
    super(router, containerService, pageStateService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.initialModalVisibility = !this.dataService.informationCollectionNoticeConsent;
  }

  continue() {
    // console.log( 'Continue');
    this.navigate(PRACTITIONER_REGISTRATION_PAGES.PRACTITIONER_INFO.fullpath);
  }

  hasToken(): boolean {
    return this.apiService.hasToken;
  }

  accept(isChecked: boolean) {
    this.dataService.informationCollectionNoticeConsent = isChecked;
  }

  setToken(token: string): void {
    this.apiService.setToken(token);
  }

  get pageTitle() {
    return PRACTITIONER_REGISTRATION_PAGES.HOME.title;
  }
}
