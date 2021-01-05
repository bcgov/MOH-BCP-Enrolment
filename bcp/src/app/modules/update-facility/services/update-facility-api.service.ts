import { Injectable } from '@angular/core';
import { BCPApiService } from '../../../services/bcp-api.service';
import { HttpClient } from '@angular/common/http';
import { SplunkLoggerService } from '../../../services/splunk-logger.service';
import { UpdateFacilityDataService } from './update-facility-data.service';
import { CommonImage } from 'moh-common-lib';
import { flatMap, catchError } from 'rxjs/operators';
import { BCPDocumentTypes } from '../../core-bcp/models/documentTypes';

@Injectable({
  providedIn: 'root'
})
export class UpdateFacilityApiService extends BCPApiService {

  constructor(protected http: HttpClient,
              protected logger: SplunkLoggerService,
              protected dataService: UpdateFacilityDataService) {
    super(http, logger, dataService);
  }

  submitForm(jsonPayLoad, signature: CommonImage, applicationUUID) {
    return this.uploadSignature(signature, applicationUUID)
      .pipe(
        flatMap(attachRes => this.submitJson(jsonPayLoad, applicationUUID, signature)),
        catchError(this.handleError.bind(this))
      );
  }

  private submitJson(jsonPayLoad: any, applicationUUID: string, signature: CommonImage<BCPDocumentTypes> ) {
    const requestUUID = this.generateUUID();
    const payload = {
      maintainFacilitySubmission: jsonPayLoad,
      requestUUID,
      applicationUUID,
      attachments: [signature.toJSON()]
    };

    this.dataService.jsonSubmission.request = payload;

    const url = `${this.baseUrl}/maintainFacility`;
    return this.post(url, payload);
  }
}
