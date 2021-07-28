import { Component, Output, EventEmitter, Input, ViewChild, AfterViewInit } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { environment } from '../../../../../environments/environment';
import { ConsentModalComponent } from 'moh-common-lib';

export const PrivacyStmt = 'Personal information is collected under the authority of the <em>Medicare Protection Act</em> ' +
                           'and section 26 (a), (c) and (e) of the <em>Freedom of Information and Protection of Privacy Act</em> ' +
                           'for the purposes of administration of the Medical Services Plan. If you have any questions about the ' +
                           'collection and use of your personal information, please contact the Health Insurance BC Chief Privacy ' +
                           'Office at Health Insurance BC, Chief Privacy Office, PO Box 9035 STN Prov Govt, Victoria BC V8W 9E3 or ' +
                           'call 604-683-7151 (Vancouver) or 1-800-663-7100 (toll free).';

@Component({
  selector: 'bcp-consent-modal',
  templateUrl: './core-consent-modal.component.html',
  styleUrls: ['./core-consent-modal.component.scss']
})
export class CoreConsentModalComponent implements AfterViewInit {
  recaptchaApiBaseUrl: string = environment.api.recaptcha;
  nonce: string = UUID.UUID();
  recaptchaPublicKey = "6LfHcJcbAAAAAJA_kkeR4AXt92hSUpCxb-mKeWkT";
  contactUsLink: string = environment.links.hibc;
  readonly privacyStatement: string  = PrivacyStmt;

  @ViewChild('bcpConsentModal', { static: true }) bcpConsentModal: ConsentModalComponent;
  @Input() hasToken: boolean;
  @Input() initialVisibility: boolean;
  @Output() accept: EventEmitter<boolean> = new EventEmitter<any>();
  @Output() validToken: EventEmitter<string> = new EventEmitter<any>();

  ngAfterViewInit() {
    if (this.initialVisibility) {
      this.bcpConsentModal.showFullSizeView();
    }
  }

  handleAccept(isChecked: boolean) {
    this.accept.emit(isChecked);
  }

  handleToken(token: string) {
    this.validToken.emit(token);
  }
}
