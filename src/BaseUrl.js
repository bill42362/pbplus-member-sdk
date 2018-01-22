// BaseUrl.js
'use strict';

const defaultState = {
    auth: 'https://authapi.pbplus.me/account/api/auth_state',
    // auth: 'https://dev-server-elb-1887534414.ap-northeast-1.elb.amazonaws.com:8096/account/api/auth_state',
    member: 'https://memberapi.pbplus.me',
    memberCenter: 'https://membercenterapi.pbplus.me',
};

const Reducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'UPDATE_PBPLUS_BASE_URL':
            return Object.assign({}, state, action.payload);
            break;
        default:
            return state;
    }
}

const updateBaseUrl = (newState) => {
    return {type: 'UPDATE_PBPLUS_BASE_URL', payload: newState};
};

export const MEMBER_CENTER_BASE_URL = 'https://membercenterapi.pbplus.me';
export const NOTICE_BASE_URL = `${MEMBER_CENTER_BASE_URL}/notifications`;
export const CALENDAR_BASE_URL = `${MEMBER_CENTER_BASE_URL}/events`;
export const POINTS_BASE_URL = `${MEMBER_CENTER_BASE_URL}/points`;
export const PERSONAL_DATA_BASE_URL = `${MEMBER_CENTER_BASE_URL}/member_data`;

export const MEMBER_BASE_URL = 'https://memberapi.pbplus.me';
export const VALIDATED_INFO_BASE_URL = `${MEMBER_BASE_URL}/getUserInfo`;
export const SEND_MOBILE_CAPTCHA_BASE_URL = `${MEMBER_BASE_URL}/sendCaptcha`;
export const VERIFY_MOBILE_CAPTCHA_BASE_URL = `${MEMBER_BASE_URL}/verifyCaptcha`;
export const FILL_EMAIL_BASE_URL = `${MEMBER_BASE_URL}/fillEmail`;

const Actions = { updateBaseUrl };

export default { Reducer, Actions };
