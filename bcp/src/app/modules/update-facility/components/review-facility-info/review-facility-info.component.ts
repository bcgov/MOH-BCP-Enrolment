import { Component, OnInit, ViewChild } from '@angular/core';
import { ReviewContainerComponent } from '../../../core-bcp/components/review-container/review-container.component';
import { UpdateFacilityDataService } from '../../services/update-facility-data.service';
import { UPDATE_FACILITY_PAGES } from '../../update-facility-route-constants';
import { setNotApplicable } from '../../../core-bcp/models/helperFunc';

@Component({
  selector: 'bcp-review-facility-info',
  templateUrl: './review-facility-info.component.html',
  styleUrls: ['./review-facility-info.component.scss']
})
export class ReviewFacilityInfoComponent implements OnInit {
  @ViewChild(ReviewContainerComponent, { static: true }) review: ReviewContainerComponent;

  constructor(public dataService: UpdateFacilityDataService) { }

  ngOnInit() {
    this.reviewItems();
  }

  reviewItems() {
    this.review.displayPrintView = this.dataService.isPrintView;
    this.review.redirectPath = UPDATE_FACILITY_PAGES.FACILITY_ADMIN.fullpath;
    this.review.header = 'Facility Information';

    const items = [
      [
        { label: 'Facility or practice name', value: this.dataService.facilityName, },
        { label: 'Medical Services Plan Facility Number', value: this.dataService.facilityMSPNumber, },
        { label: 'Contact fax number', value: setNotApplicable(this.dataService.facilityFax), },
      ],
    ];
    this.review.sectionItems = items;
  }

}
