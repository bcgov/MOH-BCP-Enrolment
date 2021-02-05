import { Component, OnInit, ViewChild } from '@angular/core';
import { ReviewContainerComponent } from 'src/app/modules/core-bcp/components/review-container/review-container.component';
import { CreateFacilityDataService } from '../../services/create-facility-data.service';
import { setNotApplicable } from '../../../core-bcp/models/helperFunc';
import { CREATE_FACILITY_PAGES } from '../../create-facility-route-constants';

@Component({
  selector: 'bcp-review-applicant',
  templateUrl: './review-applicant.component.html',
  styleUrls: ['./review-applicant.component.scss']
})
export class ReviewApplicantComponent implements OnInit {

  @ViewChild(ReviewContainerComponent, {static: true})
  review: ReviewContainerComponent;

  constructor(public dataService: CreateFacilityDataService, ) { }

  ngOnInit() {
    this.reviewItems();
  }

  reviewItems() {

    const phoneNumberEntry = { label: 'Contact phone number', value: this.dataService.facAdminPhoneNumber };
    if ( this.dataService.facAdminExtension ) {
      phoneNumberEntry.value = phoneNumberEntry.value.concat( ' Ext. ' + this.dataService.facAdminExtension );
    }

    this.review.displayPrintView = this.dataService.isPrintView;
    this.review.redirectPath = CREATE_FACILITY_PAGES.FACILITY_ADMIN.fullpath;
    this.review.header = CREATE_FACILITY_PAGES.FACILITY_ADMIN.title;

    const items = [
      [
        { label: 'First name', value: this.dataService.facAdminFirstName },
        { label: 'Last name', value: this.dataService.facAdminLastName },
        { label: 'Medical Services Plan Practitioner Number', value: this.dataService.pracNumber },
        { label: 'Contact email (optional)', value: setNotApplicable( this.dataService.emailAddress  ) },
        phoneNumberEntry
      ],
    ];
    this.review.sectionItems = items;
  }

}
