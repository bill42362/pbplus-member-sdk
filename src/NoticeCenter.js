// NoticeCenter.js
'use strict';

const defaultState = {
    notices: [
        {
            id: 0,
            date: new Date(), isNew: true, isImportant: false,
            title: '新通知', content: 'notice_content', link: 'www.google.com',
        },
        {
            id: 1,
            date: new Date(), isNew: true, isImportant: true,
            title: '新通知+重要通知', content: 'notice_content', link: 'www.google.com',
        },
        {
            id: 2,
            date: new Date(), isNew: false, isImportant: true,
            title: '已讀重要通知', content: 'notice_content',
        },
        {
            id: 3,
            date: new Date(), isNew: false, isImportant: false,
            title: '一般通知', content: 'notice_content',
        },
    ],
    expendedNoticeId: '-1',
};

const Reducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'UPDATE_PBPLUS_ECPENDED_NOTICE':
            return Object.assign({}, state, {expendedNoticeId: action.payload.id});
            break;
        default:
            return state;
    }
}

const updateExpendedNotice = ({ id }) => {
    return {type: 'UPDATE_PBPLUS_ECPENDED_NOTICE', payload: { id }};
};

const Actions = { updateExpendedNotice };

export default { Reducer, Actions };
