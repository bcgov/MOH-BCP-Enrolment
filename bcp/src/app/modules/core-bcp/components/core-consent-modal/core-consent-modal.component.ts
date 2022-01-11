import { Component, Output, EventEmitter, Input, ViewChild, AfterViewInit } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { environment } from '../../../../../environments/environment';
import { ConsentModalComponent } from 'moh-common-lib';
import { SpaEnvService } from '../../../../services/spa-env.service';

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
  //captcha/recaptcha variables
  captchaApiBaseUrl: string = environment.api.captcha;
  recaptchaApiBaseUrl: string = environment.api.recaptcha;
  nonce: string = UUID.UUID();
  recaptchaPublicKey:string = "6Lcvo-8dAAAAANR43lIE65Or0IHFeapU7O3d1NY8";
  showCaptcha:boolean = true;//hides recaptcha once complete
  //END captcha/recaptcha variables

  contactUsLink: string = environment.links.hibc;
  readonly privacyStatement: string  = PrivacyStmt;

  @ViewChild('bcpConsentModal', { static: true }) bcpConsentModal: ConsentModalComponent;
  @Input() hasToken: boolean;
  @Input() initialVisibility: boolean;
  @Output() accept: EventEmitter<boolean> = new EventEmitter<any>();
  @Output() validToken: EventEmitter<string> = new EventEmitter<any>();

  constructor(private spaEnvService: SpaEnvService){}

  //captcha/recaptcha functions
  /**
   * isRecaptchaEnabled - returns true if reCaptcha is used
   *  and false if captcha is used.
   */
  get isRecaptchaEnabled(): boolean {
    const env = this.spaEnvService.getValues();
    return env && env.SPA_ENV_ENABLE_RECAPTCHA === 'true';
  }

  /**
   * handleToken - recieves a Maximus token from the captcha
   *  or recaptcha components and passes it through to the
   *  main application
   * @param token - a Maximus token to confirm the user is a
   *  human.
   */
  handleToken(token: string) {
    this.showCaptcha = false;
    this.validToken.emit(token);
  }
  //END captcha/recaptcha functions

  ngAfterViewInit() {
    if (this.initialVisibility) {
      this.bcpConsentModal.showFullSizeView();
    }
  }

  handleAccept(isChecked: boolean) {
    this.accept.emit(isChecked);
  }
}
