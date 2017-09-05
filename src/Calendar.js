// Calendar.js
'use strict';

const today = new Date();
const defaultState = {month: today.getMonth(), year: today.getFullYear()};

const Reducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'UPDATE_CALENDAR_MONTH':
            return Object.assign({}, state, action.payload);
            break;
        default:
            return state;
    }
}

const updateMonth = ({ year, month }) => {
    return {type: 'UPDATE_CALENDAR_MONTH', payload: { year, month }};
};

const Actions = { updateMonth };

export default { Reducer, Actions };
