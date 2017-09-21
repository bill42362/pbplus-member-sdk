// NoticeCenter.js
'use strict';
import 'isomorphic-fetch';
import { NOTICE_BASE_URL } from './BaseUrl.js';

const defaultState = {
    notices: [],
    expendedNoticeId: '-1',
};

const Reducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'UPDATE_PBPLUS_ECPENDED_NOTICE':
            return Object.assign({}, state, {expendedNoticeId: action.payload.id});
            break;
        case 'UPDATE_PBPLUS_NOTICES':
            return Object.assign({}, state, action.payload);
            break;
        default:
            return state;
    }
}

const updateExpendedNotice = ({ id }) => {
    return {type: 'UPDATE_PBPLUS_ECPENDED_NOTICE', payload: { id }};
};

const updateNotices = ({ notices }) => {
    return {type: 'UPDATE_PBPLUS_NOTICES', payload: { notices }};
};

const fetchNotices = () => { return (dispatch, getState) => {
    const { userUuid: uuid } = getState().pbplusMemberCenter;
    fetch(`${NOTICE_BASE_URL}`, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ uuid })
    })
    .then(response => {
        if(response.status >= 400) { throw new Error('Bad response from server'); }
        return response.json();
    })
    .then(response => {
        const notices = response.message.map(notice => ({
            id: notice.id,
            isNew: !!notice.status,
            isImportant: '1' === notice.flag,
            title: notice.title,
            content: notice.message,
            link: notice.link,
            date: notice.date ? new Date(notice.date) : new Date(),
        }));
        dispatch(updateNotices({ notices }));
    })
    .catch(error => { console.log(error); });
}; };

const Actions = { updateExpendedNotice, fetchNotices };

export default { Reducer, Actions };
