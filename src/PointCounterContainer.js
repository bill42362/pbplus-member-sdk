// PointCounterContainer.js
import { connect } from 'react-redux';
import React from 'react';
import PointCounter from './PointCounter.js';
import MemberCenter from './MemberCenter.js';
import { PbplusPointCounter } from 'pbplus-member-ui';

const PointCounterContainer = connect(
    (state, ownProps) => {
        const { points, rewards } = state.pbplusMemberCenter.pointCounter;
        return {
            points: points - rewards.reduce((current, reward) => {
                return current + (reward.selectedCount*reward.pointCost);
            }, 0),
            rewards,
        };
    },
    (dispatch, ownProps) => { return {
        fetchRewardList: () => dispatch(PointCounter.Actions.fetchRewardList()),
        updateRewardSelectCount: ({ id, count }) => {
            return dispatch(PointCounter.Actions.updateRewardSelectCount({ id, count }));
        },
        fetchPoints: () => dispatch(PointCounter.Actions.fetchPoints()),
        submit: ({ orders }) => {
            return dispatch(PointCounter.Actions.submit({ orders }))
            .then(dispatch(MemberCenter.Actions.updateActiveTab('notice-center')));
        },
    }; }
)(PbplusPointCounter);

export default PointCounterContainer;
