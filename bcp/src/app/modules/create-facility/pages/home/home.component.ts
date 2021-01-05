import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PageStateService, ContainerService } from 'moh-common-lib';
import { CreateFacilityDataService } from '../../services/create-facility-data.service';
import { Router } from '@angular/router';
import { CREATE_FACILITY_PAGES } from '../../create-facility-route-constants';

import { BcpBaseForm } from '../../../core-bcp/models/bcp-base-form';
import { CreateFacilityApiService } from '../../services/create-facility-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends BcpBaseForm implements OnInit, AfterViewInit {

  initialModalVisibility: boolean = false;

  constructor(private dataService: CreateFacilityDataService,
              protected router: Router,
              protected pageStateService: PageStateService,
              private ApiService: CreateFacilityApiService,
              protected containerService: ContainerService) {
    super(router, containerService, pageStateService);
  }

  get pageTitle() {
    return CREATE_FACILITY_PAGES.HOME.title;
  }

  ngOnInit() {
    super.ngOnInit();
    this.initialModalVisibility = !this.dataService.informationCollectionNoticeConsent;
  }

  canContinue() {
    return this.dataService.informationCollectionNoticeConsent;
  }

  continue() {

    if (this.canContinue()) {
      this.navigate(CREATE_FACILITY_PAGES.FACILITY_ADMIN.fullpath);
    }
  }

  hasToken(): boolean {
    return this.ApiService.hasToken;
  }

  accept(isChecked: boolean) {
    this.dataService.informationCollectionNoticeConsent = isChecked;
  }

  setToken(token: string): void {
    this.ApiService.setToken(token);
  }
}
