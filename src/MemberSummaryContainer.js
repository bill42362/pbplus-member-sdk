// MemberSummaryContainer.js
import { connect } from 'react-redux';
import React from 'react';
import MemberSummary from './MemberSummary.js';
import { PbplusMemberSummary } from 'pbplus-member-ui';

const MemberSummaryContainer = connect(
    (state, ownProps) => {
        return Object.assign(
            {},
            state.pbplusMemberCenter.memberSummary,
            {
                userPhoto: state.pbplusMemberCenter.pictureEditor.image.src,
                nickname: state.pbplusMemberCenter.personalData.nickname,
            },
            {
                points: state.pbplusMemberCenter.pointCounter.points,
                pointsLastRenewDate: state.pbplusMemberCenter.pointCounter.pointsLastRenewDate,
            },
            {random: Math.random()}
        );
    },
    (dispatch, ownProps) => {
        const { memberCenterBaseUrl } = ownProps;
        return {
            fetchMemberSummary: () => { dispatch(MemberSummary.Actions.fetchMemberSummary({ memberCenterBaseUrl })); },
        };
    }
)(PbplusMemberSummary);

export default MemberSummaryContainer;
