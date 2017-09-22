// DisplayState.js
'use strict';

const defaultState = {
    phase: 'hidden',
    activeTab: 'notice-center',
};

const Reducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'UPDATE_PBPLUS_MEMBER_CENTER_DISPLAY_STATE':
            return Object.assign({}, state, {phase: action.payload.displayState});
            break;
        case 'UPDATE_PBPLUS_MEMBER_CENTER_ACTIVE_TAB':
            return Object.assign({}, state, action.payload);
            break;
        default:
            return state;
    }
}

const updateDisplayState = ({ displayState }) => {
    return {type: 'UPDATE_PBPLUS_MEMBER_CENTER_DISPLAY_STATE', payload: { displayState }};
};

const updateActiveTab = ({ activeTab }) => {
    return {type: 'UPDATE_PBPLUS_MEMBER_CENTER_ACTIVE_TAB', payload: { activeTab }};
};

const Actions = { updateDisplayState, updateActiveTab };

export default { Reducer, Actions };
