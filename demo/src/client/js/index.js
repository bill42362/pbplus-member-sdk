// index.js
'use strict';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { connect, Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
// import PbplusMemberCenter from 'pbplus-member-sdk';
import PbplusMemberCenter from '../../../../src/index.js';
import App from './App.react.js';
import '../css/index.less';

const reducer = combineReducers({
    pbplusMemberCenter: PbplusMemberCenter.Reducer,
})
const store = createStore(reducer, applyMiddleware(ReduxThunk));

const ConnectedApp = connect(
    (state, ownProps) => { return {}; },
    (dispatch, ownProps) => { return {
        showMemberCenter: () => { dispatch(PbplusMemberCenter.Actions.display()); },
    }; }
)(App);

ReactDOM.render(
    <Provider store={store}>
        <ConnectedApp />
    </Provider>,
    document.getElementById('app-root')
);
