import { Component, OnInit, ViewChild } from '@angular/core';
import { ReviewContainerComponent } from '../../../core-bcp/components/review-container/review-container.component';
import { UpdateFacilityDataService } from '../../services/update-facility-data.service';
import { UPDATE_FACILITY_PAGES } from '../../update-facility-route-constants';
import { setNotApplicable } from '../../../core-bcp/models/helperFunc';

@Component({
  selector: 'bcp-review-facility-admin',
  templateUrl: './review-facility-admin.component.html',
  styleUrls: ['./review-facility-admin.component.scss']
})
export class ReviewFacilityAdminComponent implements OnInit {
  @ViewChild(ReviewContainerComponent, { static: true }) review: ReviewContainerComponent;

  constructor(public dataService: UpdateFacilityDataService) { }

  ngOnInit() {
    this.reviewItems();
  }

  reviewItems() {
    this.review.displayPrintView = this.dataService.isPrintView;
    this.review.redirectPath = UPDATE_FACILITY_PAGES.FACILITY_ADMIN.fullpath;
    this.review.header = 'Facility Administrator Information';

    const phoneNumberEntry = {
      label: 'Phone number',
      value: this.dataService.phone
    };
    if (this.dataService.phoneExt) {
      phoneNumberEntry.value = phoneNumberEntry.value.concat(' Ext. ' + this.dataService.phoneExt);
    }

    const items = [
      [
        { label: 'First name', value: this.dataService.firstName, },
        { label: 'Last name', value: this.dataService.lastName, },
        { label: 'Email address (optional)', value: setNotApplicable(this.dataService.email), },
        phoneNumberEntry,
      ],
    ];
    this.review.sectionItems = items;
  }

}
