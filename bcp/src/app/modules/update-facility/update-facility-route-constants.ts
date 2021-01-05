import { BCP_ROUTES } from '../core-bcp/models/bcp-route-constanst';

export const UPDATE_FACILITY_PAGES = {
    HOME: {
        path: 'home',
        fullpath: `${BCP_ROUTES.UPDATE_FACILITY}/home`,
        title: 'Home'
    },
    FACILITY_ADMIN: {
        path: 'administrator-and-facility-info',
        fullpath: `${BCP_ROUTES.UPDATE_FACILITY}/administrator-and-facility-info`,
        title: 'Administrator and Facility Info'
    },
    CANCEL_CHANGE: {
        path: 'cancel-change',
        fullpath: `${BCP_ROUTES.UPDATE_FACILITY}/cancel-change`,
        title: 'Cancel / Change'
    },
    REVIEW: {
        path: 'review',
        fullpath: `${BCP_ROUTES.UPDATE_FACILITY}/review`,
        title: 'Review'
    },
    SUBMISSION: {
        path: 'submission',
        fullpath: `${BCP_ROUTES.UPDATE_FACILITY}/submission`,
        title: 'Confirmation of Submission'
    },
};
