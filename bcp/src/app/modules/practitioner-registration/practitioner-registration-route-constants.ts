import { BCP_ROUTES } from '../core-bcp/models/bcp-route-constanst';

export const PRACTITIONER_REGISTRATION_PAGES = {
    HOME: {
        path: 'home',
        fullpath: `${BCP_ROUTES.PRACTITIONER_REGISTRATION}/home`,
        title: 'Home'
    },
    PRACTITIONER_INFO: {
        path: 'practitioner-information',
        fullpath: `${BCP_ROUTES.PRACTITIONER_REGISTRATION}/practitioner-information`,
        title: 'Practitioner Information'
    },
    FACILITY_INFO: {
        path: 'facility-information',
        fullpath: `${BCP_ROUTES.PRACTITIONER_REGISTRATION}/facility-information`,
        title: 'Facility Information'
    },
    PRACTITIONER_ASSIGN: {
      path: 'practitioner-attachment',
      fullpath: `${BCP_ROUTES.PRACTITIONER_REGISTRATION}/practitioner-attachment`,
      title: 'Practitioner Attachment'
  },
    REVIEW: {
        path: 'review',
        fullpath: `${BCP_ROUTES.PRACTITIONER_REGISTRATION}/review`,
        title: 'Review Pracitioner Attachment'
    },
    SUBMISSION: {
        path: 'submission',
        fullpath: `${BCP_ROUTES.PRACTITIONER_REGISTRATION}/submission`,
        title: 'Confirmation of Submission'
    },
};
