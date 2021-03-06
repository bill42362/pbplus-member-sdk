// UserUUID.js
'use strict';
import { getUrlSearches, makeSearchString, newUuid, saveCookieByName, getCookieByName } from './Utils.js';

const COOKIE_NAME = 'token_id';

const searches = getUrlSearches()
const uuidFromSearch = searches[COOKIE_NAME];
delete searches[COOKIE_NAME];
const newSearchString = makeSearchString(searches);
window.history.replaceState('', '', `${location.pathname}${newSearchString ? '?' : ''}${newSearchString}`);

const uuidFromCookie = getCookieByName({name: COOKIE_NAME});
const defaultState = uuidFromSearch || uuidFromCookie || newUuid();

const saveUuidToCookie = ({ uuid }) => {
    const dateNow = new Date();
    const dateTwoWeeksLater = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate() + 14);
    saveCookieByName({
        name: COOKIE_NAME, data: uuid, expireDate: dateTwoWeeksLater,
        domain: '.pbplus.me', path: '/',
    });
};

if(!uuidFromCookie || (uuidFromSearch && uuidFromSearch !== uuidFromCookie)) {
    saveUuidToCookie({uuid: defaultState});
}

const Reducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'UPDATE_PBPLUS_USER_UUID':
            return action.payload.uuid || state;
            break;
        default:
            return state;
    }
}

const updateUserUUID = ({ uuid }) => {
    saveUuidToCookie({ uuid });
    return {type: 'UPDATE_PBPLUS_USER_UUID', payload: { uuid }};
};

const renewUserUUID = () => { return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        resolve(dispatch(updateUserUUID({uuid: newUuid()})));
    });
}; };

const Actions = { updateUserUUID, renewUserUUID };

export default { Reducer, Actions };
