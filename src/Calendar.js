// Calendar.js
'use strict';
import 'isomorphic-fetch';
import { MEMBER_CENTER_BASE_URL } from './BaseUrl.js';

const today = new Date();
const defaultState = {
    selectedDate: today,
    month: today.getMonth(),
    year: today.getFullYear(),
    events: [],
    promotions: [],
};

const Reducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'UPDATE_PBPLUS_CALENDAR_SELECTED_DATE':
        case 'UPDATE_PBPLUS_CALENDAR_ITEMS':
        case 'UPDATE_PBPLUS_CALENDAR_MONTH':
            return Object.assign({}, state, action.payload);
            break;
        default:
            return state;
    }
}

const updateSelectedDate = ({ date }) => {
    return {type: 'UPDATE_PBPLUS_CALENDAR_SELECTED_DATE', payload: {selectedDate: date}};
};

const updateMonth = ({ year, month }) => {
    return {type: 'UPDATE_PBPLUS_CALENDAR_MONTH', payload: { year, month }};
};

const fetchCommingEvents = () => { return (dispatch, getState) => {
    fetch(`${MEMBER_CENTER_BASE_URL}/comming_events`, {method: 'get'})
    .then(response => {
        if(response.status >= 400) { throw new Error("Bad response from server"); }
        return response.json();
    })
    .then(response => {
        const { events, promotions } = response.message;
        dispatch({type: 'UPDATE_PBPLUS_CALENDAR_ITEMS', payload: {
            events: events || [],
            promotions: promotions || [],
        }});
    })
    .catch(error => { console.log(error); });
}; };

const Actions = { updateSelectedDate, updateMonth, fetchCommingEvents };

export default { Reducer, Actions };
