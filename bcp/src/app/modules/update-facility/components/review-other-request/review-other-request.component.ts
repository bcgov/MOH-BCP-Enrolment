import { Component, OnInit, ViewChild } from '@angular/core';
import { ReviewContainerComponent } from '../../../core-bcp/components/review-container/review-container.component';
import { UpdateFacilityDataService } from '../../services/update-facility-data.service';
import { UPDATE_FACILITY_PAGES } from '../../update-facility-route-constants';
import { setNotApplicable } from '../../../core-bcp/models/helperFunc';

@Component({
  selector: 'bcp-review-other-request',
  templateUrl: './review-other-request.component.html',
  styleUrls: ['./review-other-request.component.scss']
})
export class ReviewOtherRequestComponent implements OnInit {
  @ViewChild(ReviewContainerComponent, { static: true }) review: ReviewContainerComponent;

  constructor(public dataService: UpdateFacilityDataService) { }

  ngOnInit() {
    this.reviewItems();
  }

  reviewItems() {
    this.review.displayPrintView = this.dataService.isPrintView;
    this.review.redirectPath = UPDATE_FACILITY_PAGES.CANCEL_CHANGE.fullpath;
    this.review.pageSection = 'other-request';
    this.review.header = 'Other Change or Request';

    const items = [
      [
        { label: null, value: setNotApplicable(this.dataService.otherChangeRequests), },
      ],
    ];
    this.review.sectionItems = items;
  }

}
