// Calendar.js
'use strict';
import 'isomorphic-fetch';

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

const fetchCommingEvents = ({ memberCenterBaseUrl }) => { return (dispatch, getState) => {
    const { userUuid: uuid } = getState().pbplusMemberCenter;
    let allEvents = [], allPromotions = [];
    fetch(`${memberCenterBaseUrl}/events/comming_events`, {method: 'get'})
    .then(response => {
        if(response.status >= 400) { throw new Error('Bad response from server'); }
        return response.json();
    })
    .then(response => {
        const { events = [], promotions } = response.message;
        allPromotions = promotions || [];
        allEvents = events.map(event => Object.assign({}, event, {isParticipated: false}));
    })
    .then(() => {
        return fetch(`${memberCenterBaseUrl}/events/participation`, {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ uuid })
        });
    })
    .then(response => {
        if(response.status >= 400) { throw new Error('Bad response from server'); }
        return response.json();
    })
    .then(response => {
        if(response.status >= 400) { throw new Error('Empty response from server'); }
        const participatedEvents = response.message.map(event => {
            return Object.assign({}, event, {
                link: `https://event.pbplus.me/event/${event.event_id}/info`,
                isParticipated: true,
            });
        });
        participatedEvents.forEach(participatedEvent => {
            const eventsWithoutPromote = allEvents.filter(event => {
                return event.isParticipated || event.id !== participatedEvent.event_id;
            });
            allEvents = [...eventsWithoutPromote, participatedEvent];
        });
        dispatch({type: 'UPDATE_PBPLUS_CALENDAR_ITEMS', payload: {
            events: allEvents,
            promotions: allPromotions,
        }});
    })
    .catch(error => { console.log(error); });
}; };

const Actions = { updateSelectedDate, updateMonth, fetchCommingEvents };

export default { Reducer, Actions };
