import { Component, OnInit, ViewChild } from '@angular/core';
import { SubheadingReviewContainerComponent } from '../subheading-review-container/subheading-review-container.component';
import { UpdateFacilityDataService } from '../../services/update-facility-data.service';
import { UPDATE_FACILITY_PAGES } from '../../update-facility-route-constants';
import { formatDateForDisplay, setNotApplicable } from '../../../core-bcp/models/helperFunc';

@Component({
  selector: 'bcp-review-mailing-address',
  templateUrl: './review-mailing-address.component.html',
  styleUrls: ['./review-mailing-address.component.scss']
})
export class ReviewMailingAddressComponent implements OnInit {
  @ViewChild(SubheadingReviewContainerComponent, { static: true }) review: SubheadingReviewContainerComponent;

  constructor(public dataService: UpdateFacilityDataService) { }

  ngOnInit() {
    this.reviewItems();
  }

  reviewItems() {
    this.review.displayPrintView = this.dataService.isPrintView;
    this.review.redirectPath = UPDATE_FACILITY_PAGES.CANCEL_CHANGE.fullpath;
    this.review.pageSection = 'mailing-address';
    this.review.header = 'Change Facility Mailing Address';

    if (this.dataService.checkChangeMailingAddress) {
      this.review.sections = [
        {
          isSubSection: true,
          title: 'Previous mailing address',
          items: [
            { label: 'Mailing address', value: setNotApplicable(this.dataService.changeMailingAddressPreviousAddress) },
            { label: 'City', value: setNotApplicable(this.dataService.changeMailingAddressPreviousCity) },
            { label: 'Province', value: 'British Columbia' },
            { label: 'Postal code', value: setNotApplicable(this.dataService.changeMailingAddressPreviousPostalCode) },
          ]
        },
        {
          isSubSection: true,
          title: 'New mailing address',
          items: [
            { label: 'Mailing address', value: setNotApplicable(this.dataService.changeMailingAddressNewAddress) },
            { label: 'City', value: setNotApplicable(this.dataService.changeMailingAddressNewCity) },
            { label: 'Province', value: 'British Columbia' },
            { label: 'Postal code', value: setNotApplicable(this.dataService.changeMailingAddressNewPostalCode) },
          ]
        },
        {
          isSubSection: false,
          label: 'Effective date of address change',
          value: formatDateForDisplay(this.dataService.changeMailingAddressEffectiveDate),
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
