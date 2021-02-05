import { Component, OnInit, ViewChild } from '@angular/core';
import { ReviewContainerComponent } from '../../../core-bcp/components/review-container/review-container.component';
import { UpdateFacilityDataService } from '../../services/update-facility-data.service';
import { UPDATE_FACILITY_PAGES } from '../../update-facility-route-constants';
import { setNotApplicable, convertToYesNo, formatDateForDisplay } from '../../../core-bcp/models/helperFunc';

@Component({
  selector: 'bcp-review-cancel-facility',
  templateUrl: './review-cancel-facility.component.html',
  styleUrls: ['./review-cancel-facility.component.scss']
})
export class ReviewCancelFacilityComponent implements OnInit {
  @ViewChild(ReviewContainerComponent, { static: true }) review: ReviewContainerComponent;

  constructor(public dataService: UpdateFacilityDataService) { }

  ngOnInit() {
    this.reviewItems();
  }

  reviewItems() {
    this.review.displayPrintView = this.dataService.isPrintView;
    this.review.redirectPath = UPDATE_FACILITY_PAGES.CANCEL_CHANGE.fullpath;
    this.review.pageSection = 'cancel-facility';
    this.review.header = 'Cancellation of Facility Number';

    const items = [
      [
        { label: 'Cancel Facility Number', value: convertToYesNo(this.dataService.checkCancelFacilityNumber), },
        { label: 'Cancellation date', value: setNotApplicable(formatDateForDisplay(this.dataService.cancelFacilityNumberCancelDate)), },
      ],
    ];
    if (this.dataService.checkCancelFacilityNumber) {
      this.review.sectionItems = items;
    } else {
      this.review.sectionItems = [
        [
          {
            label: null,
            value: 'N/A'
          }
        ]
      ];
    }
  }
}
