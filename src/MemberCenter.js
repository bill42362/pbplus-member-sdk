// MemberCenter.js
'use strict';
import 'isomorphic-fetch';
import { combineReducers } from 'redux';
import DisplayState from './DisplayState.js';
import BaseUrl from './BaseUrl.js';
import UserUUID from './UserUUID.js';
import MemberSummary from './MemberSummary.js';
import NoticeCenter from './NoticeCenter.js';
import Calendar from './Calendar.js';
import PointCounter from './PointCounter.js';
import PersonalData from './PersonalData.js';
import PictureEditor from './PictureEditor.js';

const Reducer = combineReducers({
    baseUrl: BaseUrl.Reducer,
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

const checkAuthState = ({ clientId }) => { return (dispatch, getState) => {
    const { auth: authBaseUrl } = getState().pbplusMemberCenter.baseUrl;
    const { userUuid: uuid } = getState().pbplusMemberCenter;
    return fetch(authBaseUrl, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({client_id: clientId, uuid })
    })
    .then(response => {
        if(response.status >= 400) { throw new Error('Bad response from server'); }
        return response.json();
    })
    .then(response => {
        const { status } = response;
        const { endpoint } = response.message;
        if(200 === status) {
            return {isUserLoggedIn: true, endpoint };
        } else if(498 === status) {
            return dispatch(UserUUID.Actions.renewUserUUID())
                .then(() => { return {isUserLoggedIn: false, endpoint }; });
        } else {
            return {isUserLoggedIn: false, endpoint };
        }
    })
    .catch(error => console.log);
}; };

const Actions = { display, hide, updateActiveTab, checkAuthState };

export default { Reducer, Actions };
