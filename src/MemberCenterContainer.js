// MemberCenterContainer.js
import { connect } from 'react-redux';
import React from 'react';
import MemberCenter from './MemberCenter.js';
import CalendarContainer from './CalendarContainer.js';
import PersonalDataContainer from './PersonalDataContainer.js';
import { PbplusMemberCenter } from 'pbplus-member-ui';

const MemberCenterContainer = connect(
    (state, ownProps) => { return {
        displayState: state.pbplusMemberCenter.displayState,
        calendar: <CalendarContainer />,
        personalData: <PersonalDataContainer />,
    }; },
    (dispatch, ownProps) => { return {
        hide: () => { dispatch(MemberCenter.Actions.hide()); },
    }; }
)(PbplusMemberCenter);

export default MemberCenterContainer;
