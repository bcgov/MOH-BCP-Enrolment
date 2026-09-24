import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConsentModalComponent, PageStateService } from 'moh-common-lib-angular';
import { v4 as uuidv4 } from 'uuid';
import { UPDATE_FACILITY_PAGES } from '../../update-facility-route-constants';
import { ContainerService } from 'moh-common-lib-angular';
import { UpdateFacilityDataService } from '../../services/update-facility-data.service';
import { environment } from '../../../../../environments/environment';
import { BcpBaseForm } from '../../../core-bcp/models/bcp-base-form';
import { UpdateFacilityApiService } from '../../services/update-facility-api.service';

@Component({
  standalone: false,
  selector: 'bcp-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends BcpBaseForm implements OnInit {

  @ViewChild('bcpConsentModal', { static: true }) bcpConsentModal: ConsentModalComponent;
  nonce: string = uuidv4();
  captchaApiBaseUrl = environment.api.captcha;
  recaptchaApiBaseUrl = environment.api.recaptcha;
  initialModalVisibility = false;

  constructor( protected containerService: ContainerService,
               protected router: Router,
               protected pageStateService: PageStateService,
               private apiService: UpdateFacilityApiService,
               private dataService: UpdateFacilityDataService ) {
    super(router, containerService, pageStateService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.initialModalVisibility = !this.dataService.informationCollectionNoticeConsent;
  }

  continue() {
    // console.log( 'Continue');
    this.navigate(UPDATE_FACILITY_PAGES.FACILITY_ADMIN.fullpath);
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
    return UPDATE_FACILITY_PAGES.HOME.title;
  }
}
