// MemberCenter.js
'use strict';
import { combineReducers } from 'redux';
import DisplayState from './DisplayState.js';
import UserUUID from './UserUUID.js';
import MemberSummary from './MemberSummary.js';
import NoticeCenter from './NoticeCenter.js';
import Calendar from './Calendar.js';
import PointCounter from './PointCounter.js';
import PersonalData from './PersonalData.js';
import PictureEditor from './PictureEditor.js';

const Reducer = combineReducers({
    userUuid: UserUUID.Reducer,
    displayState: DisplayState.Reducer,
    memberSummary: MemberSummary.Reducer,
    noticeCenter: NoticeCenter.Reducer,
    calendar: Calendar.Reducer,
    pointCounter: PointCounter.Reducer,
    personalData: PersonalData.Reducer,
    pictureEditor: PictureEditor.Reducer,
});

const display = () => { return (dispatch, getState) => {
    dispatch(DisplayState.Actions.updateDisplayState({displayState: 'display'}));
}; };

const hide = () => { return (dispatch, getState) => {
    dispatch(DisplayState.Actions.updateDisplayState({displayState: 'hiding'}));
    setTimeout(() => dispatch(DisplayState.Actions.updateDisplayState({displayState: 'hidden'})), 600);
}; };

const updateActiveTab = ({ activeTab }) => { return (dispatch, getState) => {
    dispatch(DisplayState.Actions.updateActiveTab({ activeTab }));
}; };

const Actions = { display, hide, updateActiveTab };

export default { Reducer, Actions };
