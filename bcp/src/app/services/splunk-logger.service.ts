import { Injectable } from '@angular/core';
import { CommonLogger } from 'moh-common-lib';
import { UUID } from 'angular2-uuid';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

// Uses the CommonLogger, and the CommonLogEvents
@Injectable({
  providedIn: 'root'
})
export class SplunkLoggerService extends CommonLogger {

  constructor(protected http: HttpClient) {
    super(http);
    this.setURL(environment.api.splunk);
    this.programName = 'bcp';
    // generate session per refresh as no state persists.
    this.applicationId = UUID.UUID();
   }
}
