// DisplayState.js
'use strict';

const defaultState = 'hidden';

const Reducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'UPDATE_MEMBER_CENTER_DISPLAY_STATE':
            return action.payload.displayState;
            break;
        default:
            return state;
    }
}

const updateDisplayState = ({ displayState }) => {
    return {type: 'UPDATE_MEMBER_CENTER_DISPLAY_STATE', payload: { displayState }};
};

const Actions = { updateDisplayState };

export default { Reducer, Actions };
