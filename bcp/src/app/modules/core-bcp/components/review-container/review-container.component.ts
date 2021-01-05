import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { scrollToElement } from '../../helpers/scroll-helper';

@Component({
    selector: 'bcp-review-container',
    templateUrl: './review-container.component.html',
    styleUrls: ['./review-container.component.scss'],
})
export class ReviewContainerComponent implements OnInit {
    @Input() hideReviewSection: boolean = false;
    @Input() header: string | null;
    @Input() redirectPath: string | null;
    @Input() pageSection: string | null;
    @Input() sectionItems: any | null;
    @Input() showCheckBoxList: boolean = false;

    // Display as print view - no icons, no grey boxes
    @Input() displayPrintView: boolean = false;

    constructor(private router: Router) {}

    ngOnInit() {}

    redirect(routeName: string) {
        this.router.navigate([routeName]);

        // Scroll to page section anchor.
        if (this.pageSection) {
            scrollToElement('a[name=\'' + this.pageSection + '\']');
        }
    }

    containsMultiLine(text: string): boolean {
        if (!text) {
            return false;
        }
        const lineCount = text.split(/\r\n|\r|\n/).length;
        return lineCount > 1;
    }

    getMultiLineHTML(text: string): string {
        if (!text) {
            return null;
        }
        const str = this.escapeHTML(text);
        return str.replace(/\n/g, '<br\/>');
    }

    private escapeHTML(text: string): string {
        return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
}
