import { Component, OnInit, ViewChild } from '@angular/core';
import { ReviewContainerComponent } from 'src/app/modules/core-bcp/components/review-container/review-container.component';
import { CreateFacilityDataService } from '../../services/create-facility-data.service';
import { CREATE_FACILITY_PAGES } from '../../create-facility-route-constants';

@Component({
  selector: 'bcp-review-facility-bcp',
  templateUrl: './review-facility-bcp.component.html',
  styleUrls: ['./review-facility-bcp.component.scss']
})
export class ReviewFacilityBcpComponent implements OnInit {

  @ViewChild(ReviewContainerComponent, {static: true})
  review: ReviewContainerComponent;

  constructor(public dataService: CreateFacilityDataService) { }

  ngOnInit() {
    this.reviewItems();
  }

  reviewItems() {

    this.review.displayPrintView = this.dataService.isPrintView;
    this.review.redirectPath = CREATE_FACILITY_PAGES.FACILITY_INFO.fullpath;
    this.review.header = 'Business Cost Premium';

    const items = [
      [
        {
          label: null,
          value: this.dataService.facInfoIsQualifyForBCP === true
            ? 'The applicant requests that the Business Cost Premium be applied to Eligible Fees paid to Eligible Physicians attached to this facility.'
            : 'The applicant requests that the Business Cost Premium not be applied to the facility referenced in this form.',
        }
      ],
    ];
    this.review.sectionItems = items;
  }

}
