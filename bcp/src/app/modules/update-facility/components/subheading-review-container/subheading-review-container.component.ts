import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ReviewContainerComponent } from '../../../core-bcp/components/review-container/review-container.component';

@Component({
    selector: 'bcp-subheading-review-container',
    templateUrl: './subheading-review-container.component.html',
    styleUrls: ['./subheading-review-container.component.scss'],
})
export class SubheadingReviewContainerComponent extends ReviewContainerComponent {
    @Input() sections: any | null;
}
