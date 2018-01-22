// NoticeCenterContainer.js
import { connect } from 'react-redux';
import React from 'react';
import NoticeCenter from './NoticeCenter.js';
import { PbplusNoticeCenter } from 'pbplus-member-ui';

const NoticeCenterContainer = connect(
    (state, ownProps) => {
        return {
            notices: state.pbplusMemberCenter.noticeCenter.notices,
            expendedNoticeId: state.pbplusMemberCenter.noticeCenter.expendedNoticeId,
        };
    },
    (dispatch, ownProps) => {
        return {
            expendNotice: ({ noticeId }) => { dispatch(NoticeCenter.Actions.updateExpendedNotice({id: noticeId})); },
            clearExpendNotice: () => { dispatch(NoticeCenter.Actions.updateExpendedNotice({id: '-1'})); },
            fetchNotices: () => { dispatch(NoticeCenter.Actions.fetchNotices()); },
        };
    }
)(PbplusNoticeCenter);

export default NoticeCenterContainer;
