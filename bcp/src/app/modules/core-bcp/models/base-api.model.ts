


/**
 * Return codes in response messages
 */
export enum ReturnCodes {
  SUCCESS = '0',
  FAILURE = '1',
  WARNING = '2',
  SYSTEM_ERROR = '-1',  // Can actually be any negative number
  SYSTEM_DOWN = '-3' // Back-end exception eg. 404 error or timeout
}

/**
 * Serves as base for both API requests *and* API responses.
 */
export interface APIBase {
  requestUUID: string;
  applicationUUID: string;
}

export interface PractitionerValidationPartial {
  firstName: string;
  lastName: string;
  number: string;
  // If validate, doctor flag must be true, otherwise false
  doctor: boolean;
}

export interface ValidatePractitionerRequest extends APIBase {
  practitioner: PractitionerValidationPartial;
}

export interface FacilityValidationPartial {
  // facilityName name must populated for facility registration, otherwise null
  facilityName: string;
  // number must populated for practitioner registration, otherwise null
  number: string;
  facilityCity?: string;
  postalCode: string;
}

/**
 * Base response message structure
 */
export interface BaseResponse extends APIBase {
  returnCode: ReturnCodes;
}

/**
 * Response for validation requests
 */
export interface ValidationResponse extends BaseResponse {
  message: string;
  manualReview?: boolean;
  effectiveDate?: string;
  cancelDate?: string;
}

export interface SubmissionResponse extends BaseResponse {
  referenceNumber?: string;
}
