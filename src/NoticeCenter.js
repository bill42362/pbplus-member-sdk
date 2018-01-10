// NoticeCenter.js
'use strict';
import 'isomorphic-fetch';

const defaultState = {
    notices: [],
    expendedNoticeId: '-1',
};

const Reducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'UPDATE_PBPLUS_EXPENDED_NOTICE':
            return Object.assign({}, state, {expendedNoticeId: action.payload.id});
            break;
        case 'UPDATE_PBPLUS_NOTICES':
            return Object.assign({}, state, action.payload);
            break;
        case 'UPDATE_PBPLUS_NOTICE':
            return Object.assign({}, state, {notices: state.notices.map(notice => {
                if(action.payload.notice.id === notice.id) {
                    return action.payload.notice;
                } else {
                    return notice;
                }
            })});
            break;
        default:
            return state;
    }
}

const updateNotice = ({ notice }) => { return (dispatch, getState) => {
    return dispatch({type: 'UPDATE_PBPLUS_NOTICE', payload: { notice }});
}; };

const updateExpendedNotice = ({ id, memberCenterBaseUrl }) => { return (dispatch, getState) => {
    const notice = getState().pbplusMemberCenter
        .noticeCenter.notices
        .filter(notice => `${id}` === `${notice.id}`)[0];
    if(notice && notice.isNew) {
        const { userUuid: uuid } = getState().pbplusMemberCenter;
        dispatch(updateNotice({notice: Object.assign({}, notice, {isNew: false})}));
        fetch(`${memberCenterBaseUrl}/notifications/open`, {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({notifications_id: id, uuid })
        });
    }
    return dispatch({type: 'UPDATE_PBPLUS_EXPENDED_NOTICE', payload: { id }});
}; };

const updateNotices = ({ notices }) => {
    return {type: 'UPDATE_PBPLUS_NOTICES', payload: { notices }};
};

const fetchNotices = ({ memberCenterBaseUrl }) => { return (dispatch, getState) => {
    const { userUuid: uuid } = getState().pbplusMemberCenter;
    return fetch(`${memberCenterBaseUrl}/notifications`, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ uuid })
    })
    .then(response => {
        if(response.status >= 400) { throw new Error('Bad response from server'); }
        return response.json();
    })
    .then(response => {
        if(200 !== response.status || null === response.message) { return; }
        const notices = response.message.map(notice => {
            const links = JSON.parse(notice.link);
            const linkTexts = JSON.parse(notice.link_text);
            return {
                id: notice.id,
                isNew: !!notice.status,
                isImportant: '1' === notice.flag,
                title: notice.title,
                content: notice.message,
                link: notice.link,
                links: links.map((link, index) => ({text: linkTexts[index] || link, href: link})),
                date: new Date(notice.date),
            };
        });
        dispatch(updateNotices({ notices }));
    })
    .catch(error => { console.log(error); });
}; };

const Actions = { updateExpendedNotice, fetchNotices };

export default { Reducer, Actions };
