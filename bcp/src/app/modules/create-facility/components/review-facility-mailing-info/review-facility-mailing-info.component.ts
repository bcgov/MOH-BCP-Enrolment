import { Component, OnInit, ViewChild } from '@angular/core';
import { ReviewContainerComponent } from 'src/app/modules/core-bcp/components/review-container/review-container.component';
import { CreateFacilityDataService } from '../../services/create-facility-data.service';
import { getProvinceDescription } from 'moh-common-lib';
import { CREATE_FACILITY_PAGES } from '../../create-facility-route-constants';

@Component({
  selector: 'bcp-review-facility-mailing-info',
  templateUrl: './review-facility-mailing-info.component.html',
  styleUrls: ['./review-facility-mailing-info.component.scss']
})
export class ReviewFacilityMailingInfoComponent implements OnInit {

  @ViewChild(ReviewContainerComponent, { static: true })
  review: ReviewContainerComponent;

  constructor(public dataService: CreateFacilityDataService) { }

  ngOnInit() {
    this.reviewItems();
  }

  reviewItems() {

    this.review.displayPrintView = this.dataService.isPrintView;
    this.review.redirectPath = CREATE_FACILITY_PAGES.FACILITY_INFO.fullpath;
    this.review.header = 'Facility Mailing Address';

    const isSameMailing = this.dataService.facInfoIsSameMailingAddress;

    const items =
      isSameMailing ?
        [
          [
            {
              label: 'Is the mailing address the same as the Physical Facility Address?',
              value: 'Yes',
            }
          ],
        ] :
        [
          [
            {
              label: 'Mailing address',
              value: this.dataService.facInfoMailAddress,
            },
            {
              label: 'City', value:
                this.dataService.facInfoMailCity
            },
            {
              label: 'Province', value:
                getProvinceDescription(this.dataService.facInfoMailProvince)
            },
            {
              label: 'Postal code', value:
                this.dataService.facInfoMailPostalCode
            }
          ],
        ];
    this.review.sectionItems = items;
  }

}
