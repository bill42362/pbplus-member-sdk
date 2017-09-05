// index.js
'use strict';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { connect, Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.react.js';
import '../css/index.less';

const reducer = combineReducers({
})
const store = createStore(reducer, applyMiddleware(ReduxThunk));

const ConnectedApp = connect(
    (state, ownProps) => { return {}; },
    (dispatch, ownProps) => { return {
    }; }
)(App);

ReactDOM.render(
    <Provider store={store}>
        <ConnectedApp />
    </Provider>,
    document.getElementById('app-root')
);
