// MemberSummaryContainer.js
import { connect } from 'react-redux';
import React from 'react';
import MemberSummary from './MemberSummary.js';
import { PbplusMemberSummary } from 'pbplus-member-ui';

const MemberSummaryContainer = connect(
    (state, ownProps) => {
        return state.pbplusMemberCenter.memberSummary;
    },
    (dispatch, ownProps) => { return {
        fetchMemberSummary: () => { dispatch(MemberSummary.Actions.fetchMemberSummary()); },
    }; }
)(PbplusMemberSummary);

export default MemberSummaryContainer;
