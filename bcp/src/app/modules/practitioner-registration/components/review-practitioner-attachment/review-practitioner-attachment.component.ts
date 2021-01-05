import { Component, OnInit, ViewChild } from '@angular/core';
import { ReviewContainerComponent } from '../../../core-bcp/components/review-container/review-container.component';
import { RegisterPractitionerDataService } from '../../services/register-practitioner-data.service';
import { PRACTITIONER_REGISTRATION_PAGES } from '../../practitioner-registration-route-constants';
import { getAttachmentReviewTextByValue, PRACTITIONER_ATTACHMENT } from '../../models/practitioner-attachment';
import { formatDateForDisplay, setNotApplicable } from '../../../core-bcp/models/helperFunc';

interface ReviewItem {
  label: string;
  value: any;
  hideColon?: boolean;
}

@Component({
  selector: 'bcp-review-practitioner-attachment',
  templateUrl: './review-practitioner-attachment.component.html',
  styleUrls: ['./review-practitioner-attachment.component.scss']
})
export class ReviewPractitionerAttachmentComponent implements OnInit {
  @ViewChild(ReviewContainerComponent, { static: true }) review: ReviewContainerComponent;

  constructor(public dataService: RegisterPractitionerDataService) { }

  ngOnInit() {
    this.reviewItems();
  }

  reviewItems() {
    this.review.displayPrintView = this.dataService.isPrintView;
    this.review.redirectPath = PRACTITIONER_REGISTRATION_PAGES.PRACTITIONER_ASSIGN.fullpath;
    this.review.header = PRACTITIONER_REGISTRATION_PAGES.PRACTITIONER_ASSIGN.title + ' For Business Cost Premium';

    const newAttachmentType: ReviewItem = {
      label: 'Is this a Locum or other temporary attachment?',
      value: this.dataService.pracNewAttachmentType ? 'Yes' : 'No',
      hideColon: true
    };
    const newAttachmentEffectiveDate: ReviewItem = {
      label: 'Effective date for new attachment',
      value: formatDateForDisplay(this.dataService.attachmentEffectiveDate)
    };
    const newAttachmentCancelDate: ReviewItem = {
      label: 'Cancellation date for new attachment',
      value: formatDateForDisplay(this.dataService.attachmentCancelDate)
    };
    const cancelDateItem: ReviewItem = {
      label: 'Cancellation date for existing attachment',
      value: formatDateForDisplay(this.dataService.attachmentCancelDate),
    };
    const changeEffectiveDateItem: ReviewItem = {
      label: 'New effective date for existing attachment (if applicable)',
      value: setNotApplicable(formatDateForDisplay(this.dataService.attachmentEffectiveDate)),
    };
    const changeCancelDateItem: ReviewItem = {
      label: 'New cancellation date for existing attachment (if applicable)',
      value: setNotApplicable(formatDateForDisplay(this.dataService.attachmentCancelDate)),
    };

    const items = [
      [
        {
          label: 'Selected change to practitioner attachment',
          value: getAttachmentReviewTextByValue(this.dataService.pracAttachmentType),
        },
      ],
    ];

    if (this.dataService.pracAttachmentType === PRACTITIONER_ATTACHMENT.NEW.value) {
      items[0].push(newAttachmentType);
    }
    if (this.dataService.pracAttachmentType === PRACTITIONER_ATTACHMENT.NEW.value) {
      items[0].push(newAttachmentEffectiveDate);
    }
    if (this.dataService.pracAttachmentType === PRACTITIONER_ATTACHMENT.NEW.value && this.dataService.pracNewAttachmentType) {
      items[0].push(newAttachmentCancelDate);
    }
    if (this.dataService.pracAttachmentType === PRACTITIONER_ATTACHMENT.CANCEL.value) {
      items[0].push(cancelDateItem);
    }
    if (this.dataService.pracAttachmentType === PRACTITIONER_ATTACHMENT.CHANGE.value) {
      items[0].push(changeEffectiveDateItem);
    }
    if (this.dataService.pracAttachmentType === PRACTITIONER_ATTACHMENT.CHANGE.value) {
      items[0].push(changeCancelDateItem);
    }
    this.review.sectionItems = items;
  }

}
