// MemberCenterContainer.js
import { connect } from 'react-redux';
import React from 'react';
import MemberCenter from './MemberCenter.js';
import MemberSummaryContainer from './MemberSummaryContainer.js';
import NoticeCenterContainer from './NoticeCenterContainer.js';
import CalendarContainer from './CalendarContainer.js';
import PointCounterContainer from './PointCounterContainer.js';
import PersonalDataContainer from './PersonalDataContainer.js';
import { PbplusMemberCenter } from 'pbplus-member-ui';

const MemberCenterContainer = connect(
    (state, ownProps) => {
        const memberBaseUrl = ownProps.memberBaseUrl || 'https://memberapi.pbplus.me';
        const memberCenterBaseUrl = ownProps.memberCenterBaseUrl || 'https://membercenterapi.pbplus.me';
        return {
            displayState: state.pbplusMemberCenter.displayState.phase,
            activeTab: state.pbplusMemberCenter.displayState.activeTab,
            //memberSummary: <MemberSummaryContainer memberCenterBaseUrl={memberCenterBaseUrl} />,
            calendar: <CalendarContainer memberCenterBaseUrl={memberCenterBaseUrl} />,
            pointCounter: <PointCounterContainer memberCenterBaseUrl={memberCenterBaseUrl} memberBaseUrl={memberBaseUrl} />,
            personalData: <PersonalDataContainer memberCenterBaseUrl={memberCenterBaseUrl} memberBaseUrl={memberBaseUrl} />,
            noticeCenter: <NoticeCenterContainer memberCenterBaseUrl={memberCenterBaseUrl} />,
        };
    },
    (dispatch, ownProps) => { return {
        hide: () => { dispatch(MemberCenter.Actions.hide()); },
        setActiveTab: ({ key }) => { dispatch(MemberCenter.Actions.updateActiveTab({activeTab: key})); },
    }; }
)(PbplusMemberCenter);

export default MemberCenterContainer;
