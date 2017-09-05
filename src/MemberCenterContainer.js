// MemberCenterContainer.js
import { connect } from 'react-redux';
import React from 'react';
import MemberCenter from './MemberCenter.js';
import CalendarContainer from './CalendarContainer.js';
import { PbplusMemberCenter } from 'pbplus-member-ui';

const MemberCenterContainer = connect(
    (state, ownProps) => { return {
        displayState: state.pbplusMemberCenter.displayState,
        calendar: <CalendarContainer />,
        personalData: <div />,
    }; },
    (dispatch, ownProps) => { return {
        hide: () => { dispatch(MemberCenter.Actions.hide()); },
    }; }
)(PbplusMemberCenter);

export default MemberCenterContainer;
