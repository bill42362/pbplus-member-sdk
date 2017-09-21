// index.js
'use strict';
import 'isomorphic-fetch';
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
const store = createStore(reducer, applyMiddleware(ReduxThunk));

const refreshAuthState = () => {
    return fetch('http://dev-server-elb-1887534414.ap-northeast-1.elb.amazonaws.com:8096/account/api/auth_state', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            client_id: 'B1B4A63EEEAF11E6888B0A28175C2AF1',
            uuid: store.getState().pbplusMemberCenter.userUuid
        })
    })
    .then(response => {
        if(response.status >= 400) { throw new Error('Bad response from server'); }
        return response.json();
    })
    .then(response => {
        store.dispatch(AuthState.Actions.updateAuthState({authState: {
            isUserLoggedIn: 200 === response.status,
            endpoint: response.message.endpoint,
        }}));
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
