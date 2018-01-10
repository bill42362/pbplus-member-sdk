// App.react.js
import { connect } from 'react-redux';
import React from 'react';
// import PbplusMemberCenter from 'pbplus-member-sdk';
import PbplusMemberCenter from '../../../../src/index.js';
import '../css/app.less';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.showMemberCenter = this.showMemberCenter.bind(this);
        this.logout = this.logout.bind(this);
    }
    showMemberCenter() {
        const { showMemberCenter } = this.props;
        if(showMemberCenter) { showMemberCenter(); }
    }
    logout() {
        const { logout } = this.props;
        if(logout) { logout(); }
    }
    render() {
        const { isUserLoggedIn, loginEndpoint } = this.props;
        return <div className='app'>
            {!isUserLoggedIn && <a className='login-pbplus-button' role='button' href={loginEndpoint}>
                登入 pb+
            </a>}
            {isUserLoggedIn && <div className='open-member-center-button' role='button' onClick={this.showMemberCenter}>
                使用者中心
            </div>}
            {isUserLoggedIn && <div className='logout-pbplus-button' role='button' onClick={this.logout}>
                登出 pb+
            </div>}
            <PbplusMemberCenter.Container
                memberBaseUrl='https://memberapi.pbplus.me'
                memberCenterBaseUrl='https://membercenterapi.pbplus.me'
            />
        </div>;
    }
}

export default App;
