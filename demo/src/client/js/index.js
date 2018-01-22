// index.js
'use strict';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { connect, Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import AuthState from './AuthState.js';
//import PbplusMemberCenter from 'pbplus-member-sdk';
import PbplusMemberCenter from '../../../../src/index.js';
import App from './App.react.js';
import '../css/index.less';

const reducer = combineReducers({
    pbplusAuthState: AuthState.Reducer,
    pbplusMemberCenter: PbplusMemberCenter.Reducer,
})
const store = createStore(
    reducer,
    {
        pbplusMemberCenter: {
            baseUrl: {
                auth: 'https://authapi.pbplus.me/account/api/auth_state',
                memberCenter: 'https://membercenterapi.pbplus.me',
                member: 'https://memberapi.pbplus.me',
            }
        }
    },
    applyMiddleware(ReduxThunk)
);

const refreshAuthState = () => {
    const clientId = '8486C5FA991611E790810ACA2C7BEF8A';
    store.dispatch(PbplusMemberCenter.Actions.checkAuthState({ clientId }))
    .then(({ isUserLoggedIn, endpoint }) => {
        store.dispatch(AuthState.Actions.updateAuthState({authState: { isUserLoggedIn, endpoint }}));
    })
    .catch(error => console.log);
};
refreshAuthState();

const ConnectedApp = connect(
    (state, ownProps) => {
        const { endpoint, isUserLoggedIn } = state.pbplusAuthState;
        const { userUuid: uuid } = state.pbplusMemberCenter;
        return {
            loginEndpoint: `${endpoint}&token_id=${uuid}&ref=${btoa(location.pathname.slice(1))}`,
            isUserLoggedIn
        };
    },
    (dispatch, ownProps) => { return {
        showMemberCenter: () => { dispatch(PbplusMemberCenter.Actions.display()); },
        logout: () => {
            dispatch(PbplusMemberCenter.Actions.renewUserUUID());
            refreshAuthState();
        },
    }; }
)(App);

ReactDOM.render(
    <Provider store={store}>
        <ConnectedApp />
    </Provider>,
    document.getElementById('app-root')
);
