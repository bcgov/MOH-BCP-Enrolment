import { Injectable } from '@angular/core';
import { CommonImage, CommonLogEvents, CommonLogMessage } from 'moh-common-lib';
import { UUID } from 'angular2-uuid';
import { BaseResponse, ReturnCodes } from '../modules/core-bcp/models/base-api.model';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseDataService {

  constructor() { }

  /**
   * Common to all applications
   */
  signature: CommonImage;
  // Date user signs declaration
  dateOfAcceptance: Date;
  dateOfSubmission: Date;

  applicationUUID: string = UUID.UUID();
  informationCollectionNoticeConsent: boolean;

  /* Used to switch review contents to a view to be printed (i.e. no edit icons,
   *  or grey background)
   */
  isPrintView: boolean = false;

  jsonApplicantValidation = {
    request: null,
    response: null
  };

  jsonFacilityValidation = {
    request: null,
    response: null
  };

  getSubmissionLogObject<T extends BaseResponse>(requestType: string, res: T ): CommonLogMessage {
    return {
      event: CommonLogEvents.submission,
      request: requestType,
      success: res.returnCode === ReturnCodes.SUCCESS || res.returnCode === ReturnCodes.WARNING,
      response: res
    };
  }

  // Convert data into a JSON payload
  abstract getJSONPayload(): any;
}
