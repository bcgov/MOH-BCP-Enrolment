import { Component, OnInit, ViewChild } from '@angular/core';
import { SubheadingReviewContainerComponent } from '../subheading-review-container/subheading-review-container.component';
import { UpdateFacilityDataService } from '../../services/update-facility-data.service';
import { UPDATE_FACILITY_PAGES } from '../../update-facility-route-constants';
import { formatDateForDisplay, setNotApplicable } from '../../../core-bcp/models/helperFunc';

@Component({
  selector: 'bcp-review-physical-address',
  templateUrl: './review-physical-address.component.html',
  styleUrls: ['./review-physical-address.component.scss']
})
export class ReviewPhysicalAddressComponent implements OnInit {
  @ViewChild(SubheadingReviewContainerComponent, { static: true }) review: SubheadingReviewContainerComponent;

  constructor(public dataService: UpdateFacilityDataService) { }

  ngOnInit() {
    this.reviewItems();
  }

  reviewItems() {
    this.review.displayPrintView = this.dataService.isPrintView;
    this.review.redirectPath = UPDATE_FACILITY_PAGES.CANCEL_CHANGE.fullpath;
    this.review.pageSection = 'physical-address';
    this.review.header = 'Change Facility Physical Address';

    if (this.dataService.checkChangeFacilityAddress) {
      this.review.sections = [
        {
          isSubSection: true,
          title: 'Previous physical facility address',
          items: [
            { label: 'Physical facility address', value: setNotApplicable(this.dataService.changeFacilityAddressPreviousAddress) },
            { label: 'City', value: setNotApplicable(this.dataService.changeFacilityAddressPreviousCity) },
            { label: 'Province', value: 'British Columbia' },
            { label: 'Postal code', value: setNotApplicable(this.dataService.changeFacilityAddressPreviousPostalCode) },
            { label: 'Fax number (optional)', value: setNotApplicable(this.dataService.changeFacilityAddressPreviousFax) },
          ]
        },
        {
          isSubSection: true,
          title: 'New physical facility address',
          items: [
            { label: 'Physical facility address', value: setNotApplicable(this.dataService.changeFacilityAddressNewAddress) },
            { label: 'City', value: setNotApplicable(this.dataService.changeFacilityAddressNewCity) },
            { label: 'Province', value: 'British Columbia' },
            { label: 'Postal code', value: setNotApplicable(this.dataService.changeFacilityAddressNewPostalCode) },
            { label: 'Fax number (optional)', value: setNotApplicable(this.dataService.changeFacilityAddressNewFax) },
          ]
        },
        {
          isSubSection: false,
          label: 'Effective date of address change',
          value: formatDateForDisplay(this.dataService.changeFacilityAddressEffectiveDate),
        },
      ];
    } else {
      this.review.sections = [
        {
          isSubSection: false,
          label: null,
          value: 'N/A'
        }
      ];
    }
  }
}
