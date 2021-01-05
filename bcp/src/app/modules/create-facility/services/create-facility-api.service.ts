import { Injectable } from '@angular/core';
import { BCPApiService } from '../../../services/bcp-api.service';
import { SplunkLoggerService } from '../../../services/splunk-logger.service';
import { CreateFacilityDataService } from './create-facility-data.service';
import { CommonImage } from 'moh-common-lib';
import { flatMap, catchError } from 'rxjs/operators';
import { BCPDocumentTypes } from '../../core-bcp/models/documentTypes';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CreateFacilityApiService extends BCPApiService {

  constructor(protected http: HttpClient,
              protected logger: SplunkLoggerService,
              protected dataService: CreateFacilityDataService) {
    super(http, logger, dataService);
  }

  /**
   * Creates a facility, uploading attachments and then JSON
   * @param jsonPayLoad Payload to submit
   * @param signature Consent signature
   * @param applicationUUID Shared UUID to use across requests.
   */
  createFacility(jsonPayLoad, signature: CommonImage, applicationUUID) {
    return this.uploadSignature(signature, applicationUUID)
      .pipe(
        flatMap(attachRes => this.submitFacilityJson(jsonPayLoad, applicationUUID, signature)),
        catchError(this.handleError.bind(this))
      );
  }

  private submitFacilityJson(jsonPayLoad: any, applicationUUID: string, signature: CommonImage<BCPDocumentTypes> ) {
    const requestUUID = this.generateUUID();
    const payload = {
      createFacilitySubmission: jsonPayLoad,
      requestUUID,
      applicationUUID,
      attachments: [signature.toJSON()]
    };

    this.dataService.jsonCreateFacility.request = payload;

    const url = `${this.baseUrl}/createFacility`;
    return this.post(url, payload);
  }

}
