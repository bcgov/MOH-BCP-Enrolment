import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UPDATE_FACILITY_PAGES } from '../../update-facility-route-constants';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UpdateFacilityDataService } from '../../services/update-facility-data.service';
import { ContainerService, PageStateService } from 'moh-common-lib';
import { BcpBaseForm } from '../../../core-bcp/models/bcp-base-form';
import { UpdateFacilityApiService } from '../../services/update-facility-api.service';
import { ValidationResponse, ReturnCodes } from '../../../core-bcp/models/base-api.model';
import { SplunkLoggerService } from '../../../../services/splunk-logger.service';
import { validMultiFormControl } from '../../../core-bcp/models/validators';


@Component({
  selector: 'bcp-facility-admin',
  templateUrl: './facility-admin.component.html',
  styleUrls: ['./facility-admin.component.scss']
})
export class FacilityAdminComponent extends BcpBaseForm implements OnInit, AfterViewInit {

  formGroup: FormGroup;

  constructor( protected containerService: ContainerService,
               protected router: Router,
               protected pageStateService: PageStateService,
               private fb: FormBuilder,
               public dataService: UpdateFacilityDataService,
               private splunkLoggerService: SplunkLoggerService,
               private apiService: UpdateFacilityApiService ) {
    super(router, containerService, pageStateService);
    this.validFormControl = validMultiFormControl;
  }

  validFormControl: (fg: FormGroup, name: string) => boolean;

  ngOnInit() {
    super.ngOnInit();

    this.formGroup = this.fb.group({
      firstName: [this.dataService.firstName, [Validators.required]],
      lastName: [this.dataService.lastName, [Validators.required]],
      email: [this.dataService.email, []],
      phone: [this.dataService.phone, [Validators.required]],
      phoneExt: [this.dataService.phoneExt, []],
      facilityName: [this.dataService.facilityName, [Validators.required, Validators.pattern(/^[ -~]+$/)]],
      facilityMSPNumber: [this.dataService.facilityMSPNumber, [Validators.required]],
      facilityFax: [this.dataService.facilityFax, []],
    });
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    // Update data service values
    this.formGroup.valueChanges.subscribe( value => {
      this.dataService.firstName = value.firstName;
      this.dataService.lastName = value.lastName;
      this.dataService.email = value.email;
      this.dataService.phone = value.phone;
      this.dataService.phoneExt = value.phoneExt;
      this.dataService.facilityName = value.facilityName;
      this.dataService.facilityMSPNumber = value.facilityMSPNumber;
      this.dataService.facilityFax = value.facilityFax;
    });
  }

  continue() {
    this.markAllInputsTouched();

    if (this.formGroup.valid) {
      this.navigate(UPDATE_FACILITY_PAGES.CANCEL_CHANGE.fullpath);
    }
  }
}
