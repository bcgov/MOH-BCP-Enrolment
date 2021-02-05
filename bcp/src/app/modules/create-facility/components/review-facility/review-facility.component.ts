import { Component, OnInit, ViewChild } from '@angular/core';
import { ReviewContainerComponent } from 'src/app/modules/core-bcp/components/review-container/review-container.component';
import { CreateFacilityDataService } from '../../services/create-facility-data.service';
import { getProvinceDescription } from 'moh-common-lib';
import { setNotApplicable } from '../../../core-bcp/models/helperFunc';
import { CREATE_FACILITY_PAGES } from '../../create-facility-route-constants';

@Component({
  selector: 'bcp-review-facility',
  templateUrl: './review-facility.component.html',
  styleUrls: ['./review-facility.component.scss']
})
export class ReviewFacilityComponent implements OnInit {
  @ViewChild(ReviewContainerComponent, { static: true })
  review: ReviewContainerComponent;

  constructor(public dataService: CreateFacilityDataService) { }

  ngOnInit() {
    this.reviewItems();
  }

  reviewItems() {

    // console.log( 'this.dataService.facInfoProvince: ', this.dataService.facInfoProvince );

    this.review.displayPrintView = this.dataService.isPrintView;
    this.review.redirectPath = CREATE_FACILITY_PAGES.FACILITY_INFO.fullpath;
    this.review.header = CREATE_FACILITY_PAGES.FACILITY_INFO.title;

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = this.dataService.facInfoEffectiveDate ?
      this.dataService.facInfoEffectiveDate.toLocaleString('en', options) : 'invalid Date from Common-Date';

    const items = [
      [
        {
          label: 'Facility or practice name',
          value: this.dataService.facInfoFacilityName,
        },
        { label: 'Physical address', value: this.dataService.facInfoPhysicalAddress },
        { label: 'City', value: this.dataService.facInfoCity },
        { label: 'Province', value: getProvinceDescription(this.dataService.facInfoProvince) },
        { label: 'Postal code', value: this.dataService.facInfoPostalCode },
        { label: 'Contact fax number (optional)', value: setNotApplicable( this.dataService.facInfoFaxNumber ) },
        { label: 'Effective date', value: dateString }
      ],
    ];
    this.review.sectionItems = items;
  }

}
