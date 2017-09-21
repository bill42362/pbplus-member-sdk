// AuthState.js
'use strict';

const defaultState = {isUserLoggedIn: false, endpoint: 'http://localhost:3000'};

const Reducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'UPDATE_PBPLUS_AUTH_STATE':
            return action.payload.authState;
            break;
        default:
            return state;
    }
}

const updateAuthState = ({ authState }) => {
    return {type: 'UPDATE_PBPLUS_AUTH_STATE', payload: { authState }};
};

const Actions = { updateAuthState };

export default { Reducer, Actions };
