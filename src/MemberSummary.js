// MemberSummary.js
'use strict';
import 'isomorphic-fetch';
import PointCounter from './PointCounter.js';
import PersonalData from './PersonalData.js';

const defaultState = {
    registeredDate: new Date(),
    coins: 50,
    eventCounts: [
        {key: 'baseball', count: 100*Math.random(), display: '棒球 %f 場', color: 'rgb(246, 185, 80)'},
        {key: 'baseketball', count: 100*Math.random(), display: '籃球 %f 場', color: 'rgb(128, 159, 232)'},
        {key: 'jogging', count: 100*Math.random(), display: '路跑 %f KM', color: 'rgb(144, 252, 128)'},
        {key: 'gym', count: 100*Math.random(), display: '健身 %f 堂', color: 'rgb(50, 200, 235)'},
    ],
    achievements: [
        {key: 'achievement-1', display: 'achi-1', imageSrc: 'https://p2.bahamut.com.tw/HOME/creationCover/40/0003703340.JPG'},
        {key: 'achievement-2', display: 'achi-2', imageSrc: 'https://p2.bahamut.com.tw/HOME/creationCover/40/0003703340.JPG'},
        {key: 'achievement-3', display: 'achi-3', imageSrc: 'https://p2.bahamut.com.tw/HOME/creationCover/40/0003703340.JPG'},
    ],
};

const Reducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'UPDATE_PBPLUS_MEMBER_SUMMARY':
            return Object.assign({}, state, action.payload);
            break;
        default:
            return state;
    }
}

const updateMemberSummary = ({ summary }) => { return (dispatch, getState) => {
    return dispatch({type: 'UPDATE_PBPLUS_MEMBER_SUMMARY', payload: { summary }});
}; };

const fetchMemberSummary = () => { return (dispatch, getState) => {
    dispatch(PointCounter.Actions.fetchPoints());
    dispatch(PersonalData.Actions.fetchData());
    return {type: 'NULL', payload: {}};
}; };

const Actions = { updateMemberSummary, fetchMemberSummary };

export default { Reducer, Actions };
