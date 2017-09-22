// MemberCenterContainer.js
import { connect } from 'react-redux';
import React from 'react';
import MemberCenter from './MemberCenter.js';
import NoticeCenterContainer from './NoticeCenterContainer.js';
import CalendarContainer from './CalendarContainer.js';
import PointCounterContainer from './PointCounterContainer.js';
import PersonalDataContainer from './PersonalDataContainer.js';
import { PbplusMemberCenter } from 'pbplus-member-ui';

const MemberCenterContainer = connect(
    (state, ownProps) => { return {
        displayState: state.pbplusMemberCenter.displayState.phase,
        activeTab: state.pbplusMemberCenter.displayState.activeTab,
        calendar: <CalendarContainer />,
        pointCounter: <PointCounterContainer />,
        personalData: <PersonalDataContainer />,
        noticeCenter: <NoticeCenterContainer />,
    }; },
    (dispatch, ownProps) => { return {
        hide: () => { dispatch(MemberCenter.Actions.hide()); },
        setActiveTab: ({ key }) => { dispatch(MemberCenter.Actions.updateActiveTab({activeTab: key})); },
    }; }
)(PbplusMemberCenter);

export default MemberCenterContainer;
