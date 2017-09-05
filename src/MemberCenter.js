// MemberCenter.js
'use strict';
import { combineReducers } from 'redux';
import DisplayState from './DisplayState.js';
import Calendar from './Calendar.js';
import PersonalData from './PersonalData.js';
import PictureEditor from './PictureEditor.js';

const defaultState = {displayState: 'display'};

const Reducer = combineReducers({
    displayState: DisplayState.Reducer,
    calendar: Calendar.Reducer,
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

const Actions = { display, hide };

export default { Reducer, Actions };
