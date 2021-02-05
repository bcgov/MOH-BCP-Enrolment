import { Component, OnInit, ViewChild } from '@angular/core';
import { ReviewContainerComponent } from '../../../core-bcp/components/review-container/review-container.component';
import { UpdateFacilityDataService } from '../../services/update-facility-data.service';
import { UPDATE_FACILITY_PAGES } from '../../update-facility-route-constants';
import { setNotApplicable, convertToYesNo, formatDateForDisplay } from '../../../core-bcp/models/helperFunc';

@Component({
  selector: 'bcp-review-change-admin',
  templateUrl: './review-change-admin.component.html',
  styleUrls: ['./review-change-admin.component.scss']
})
export class ReviewChangeAdminComponent implements OnInit {
  @ViewChild(ReviewContainerComponent, { static: true }) review: ReviewContainerComponent;

  constructor(public dataService: UpdateFacilityDataService) { }

  ngOnInit() {
    this.reviewItems();
  }

  reviewItems() {
    this.review.displayPrintView = this.dataService.isPrintView;
    this.review.redirectPath = UPDATE_FACILITY_PAGES.CANCEL_CHANGE.fullpath;
    this.review.pageSection = 'change-admin';
    this.review.header = 'Change Responsible Administrator';

    const phoneNumberEntry = {
      label: 'Phone number',
      value: setNotApplicable(this.dataService.changeAdminInfoPhoneNumber)
    };
    if (this.dataService.changeAdminInfoPhoneNumberExt) {
      phoneNumberEntry.value = phoneNumberEntry.value.concat(' Ext. ' + this.dataService.changeAdminInfoPhoneNumberExt);
    }

    const items = [
      [
        { label: 'First name', value: setNotApplicable(this.dataService.changeAdminInfoFirstName), },
        { label: 'Last name', value: setNotApplicable(this.dataService.changeAdminInfoLastName), },
        { label: 'Medical Services Plan Practitioner Number', value: setNotApplicable(this.dataService.changeAdminInfoMSPPracNumber), },
        { label: 'Email address (optional)', value: setNotApplicable(this.dataService.changeAdminInfoEmail), },
        phoneNumberEntry,
        {
          label: 'Effective date of change',
          value: setNotApplicable(formatDateForDisplay(this.dataService.changeAdminInfoEffectiveDate)),
        },
      ],
    ];

    if (this.dataService.checkChangeAdminInfo) {
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
