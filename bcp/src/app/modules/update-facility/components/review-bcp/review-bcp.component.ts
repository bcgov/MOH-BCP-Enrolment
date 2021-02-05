import { Component, OnInit, ViewChild } from '@angular/core';
import { ReviewContainerComponent } from '../../../core-bcp/components/review-container/review-container.component';
import { UpdateFacilityDataService } from '../../services/update-facility-data.service';
import { UPDATE_FACILITY_PAGES } from '../../update-facility-route-constants';
import { setNotApplicable, convertToYesNo, convertToJSONDate, formatDateForDisplay } from '../../../core-bcp/models/helperFunc';

@Component({
  selector: 'bcp-review-bcp',
  templateUrl: './review-bcp.component.html',
  styleUrls: ['./review-bcp.component.scss']
})
export class ReviewBCPComponent implements OnInit {
  @ViewChild(ReviewContainerComponent, { static: true }) review: ReviewContainerComponent;

  constructor(public dataService: UpdateFacilityDataService) { }

  ngOnInit() {
    this.reviewItems();
  }

  reviewItems() {
    this.review.displayPrintView = this.dataService.isPrintView;
    this.review.redirectPath = UPDATE_FACILITY_PAGES.CANCEL_CHANGE.fullpath;
    this.review.pageSection = 'bcp';
    this.review.header = 'Business Cost Premium';

    this.review.sectionItems = [[]];

    if ( this.dataService.checkChangeAppliesFees
      || this.dataService.checkCancelBCP
      || this.dataService.checkChangeBCPEffectiveDate
      || this.dataService.checkChangeBCPCancelDate) {

      if (this.dataService.checkChangeAppliesFees) {
        this.review.sectionItems[0].push({
          label: 'The applicant requests that the Business Cost Premium be applied to Eligible Fees paid to Eligible Physicians attached to this facility.',
          value: convertToYesNo(this.dataService.checkChangeAppliesFees),
        });

        this.review.sectionItems[0].push({
          label: 'Effective date',
          value: setNotApplicable(formatDateForDisplay(this.dataService.changeAppliesFeesEffectiveDate)),
        });
      }

      if (this.dataService.checkCancelBCP) {
        this.review.sectionItems[0].push({
          label: 'Cancel BCP',
          value: convertToYesNo(this.dataService.checkCancelBCP),
        });

        this.review.sectionItems[0].push({
          label: 'Effective cancel date',
          value: setNotApplicable(formatDateForDisplay(this.dataService.cancelBCPEffectiveDate)),
        });
      }

      if (this.dataService.checkChangeBCPEffectiveDate) {
        this.review.sectionItems[0].push({
          label: 'Change BCP effective date',
          value: convertToYesNo(this.dataService.checkChangeBCPEffectiveDate),
        });

        this.review.sectionItems[0].push({
          label: 'New BCP effective date',
          value: setNotApplicable(formatDateForDisplay(this.dataService.changeBCPEffectiveDateEffectiveDate)),
        });
      }

      if (this.dataService.checkChangeBCPCancelDate) {
        this.review.sectionItems[0].push({
          label: 'Change BCP cancellation date',
          value: convertToYesNo(this.dataService.checkChangeBCPCancelDate),
        });

        this.review.sectionItems[0].push({
          label: 'New BCP cancel date',
          value: setNotApplicable(formatDateForDisplay(this.dataService.changeBCPCancelDateCancelDate)),
        });
      }
    } else {
      this.review.sectionItems[0].push({
        label: null,
        value: 'N/A'
      });
    }
  }
}
