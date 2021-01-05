import { BCP_ROUTES } from '../core-bcp/models/bcp-route-constanst';

export const CREATE_FACILITY_PAGES = {
    HOME: {
        path: 'home',
        fullpath: `${BCP_ROUTES.CREATE_FACILITY}/home`,
        title: 'Home'
    },
    FACILITY_ADMIN: {
        path: 'administrator-information',
        fullpath: `${BCP_ROUTES.CREATE_FACILITY}/administrator-information`,
        title: 'Administrator Information'
    },
    FACILITY_INFO: {
        path: 'facility-information',
        fullpath: `${BCP_ROUTES.CREATE_FACILITY}/facility-information`,
        title: 'Facility Information'
    },
    REVIEW: {
        path: 'review',
        fullpath: `${BCP_ROUTES.CREATE_FACILITY}/review`,
        title: 'Review Application'
    },
    SUBMISSION: {
        path: 'submission',
        fullpath: `${BCP_ROUTES.CREATE_FACILITY}/submission`,
        title: 'Confirmation of Submission'
    },
};
