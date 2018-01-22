// PointCounterContainer.js
import { connect } from 'react-redux';
import React from 'react';
import PointCounter from './PointCounter.js';
import MemberCenter from './MemberCenter.js';
import {
    PbplusPointCounter,
    PbplusPointCounterRewardTypeTab,
    PbplusPointCounterReceiverInfo
} from 'pbplus-member-ui';

const rewardTypes = [
    {key: 'virtual', display: '折扣兌換'},
    {key: 'real', display: '超值兌物'},
];
const ConnectedPbplusPointCounterRewardTypeTab = connect(
    (state, ownProps) => {
        const { usingRewardType } = state.pbplusMemberCenter.pointCounter;
        return { usingRewardType, rewardTypes };
    },
    (dispatch, ownProps) => { return {
        updateUsingRewardType: ({ rewardType: rewardTypeKey }) => {
            const rewardType = rewardTypes.filter(rewardType => rewardTypeKey === rewardType.key)[0] || rewardTypes[0];
            return dispatch(PointCounter.Actions.updateUsingRewardType({usingRewardType: rewardType.key}));
        },
    }; }
)(PbplusPointCounterRewardTypeTab);

const ConnectedPbplusPointCounterReceiverInfo = connect(
    (state, ownProps) => {
        const { name, country, mobile, zipcode, address } = state.pbplusMemberCenter.pointCounter.receiverInfo;
        return { name, country, mobile, zipcode, address };
    },
    (dispatch, ownProps) => { return {
        updateReceiverInfo: ({ newValueMap }) => {
            return dispatch(PointCounter.Actions.updateReceiverInfo({ newValueMap }));
        },
    }; }
)(PbplusPointCounterReceiverInfo);

const PointCounterContainer = connect(
    (state, ownProps) => {
        const { points, rewards, usingRewardType, usingNotice, isNoticeChecked } = state.pbplusMemberCenter.pointCounter;
        const usingRewards = rewards.filter(reward => usingRewardType === reward.type);
        let canSubmit = isNoticeChecked && !!usingRewards.filter(reward => reward.selectedCount).length;
        if('real' === usingRewardType) {
            const { name, country, mobile, zipcode, address } = state.pbplusMemberCenter.pointCounter.receiverInfo;
            canSubmit = canSubmit && !!(name && country && mobile && zipcode && address);
        }
        return {
            points: points - usingRewards.reduce((current, reward) => {
                return current + (reward.selectedCount*reward.pointCost);
            }, 0),
            rewards: usingRewards,
            rewardTypeTab: <ConnectedPbplusPointCounterRewardTypeTab />,
            receiverInfo: <ConnectedPbplusPointCounterReceiverInfo />,
            usingRewardType, usingNotice, isNoticeChecked, canSubmit
        };
    },
    (dispatch, ownProps) => {
        return {
            fetchPersonalData: () => dispatch(PointCounter.Actions.fetchPersonalData()),
            fetchRewardList: () => dispatch(PointCounter.Actions.fetchRewardList()),
            updateRewardSelectCount: ({ id, count }) => {
                return dispatch(PointCounter.Actions.updateRewardSelectCount({ id, count }));
            },
            fetchPoints: () => dispatch(PointCounter.Actions.fetchPoints()),
            updateIsNoticeChecked: ({ isNoticeChecked }) => {
                return dispatch(PointCounter.Actions.updateIsNoticeChecked({ isNoticeChecked }));
            },
            submit: ({ orders }) => {
                return dispatch(PointCounter.Actions.submit({ orders }))
                .then(dispatch(MemberCenter.Actions.updateActiveTab('notice-center')));
            },
        };
    }
)(PbplusPointCounter);

export default PointCounterContainer;
