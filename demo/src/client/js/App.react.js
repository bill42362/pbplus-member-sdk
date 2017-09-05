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
    }
    showMemberCenter() {
        const { showMemberCenter } = this.props;
        if(showMemberCenter) { showMemberCenter(); }
    }
    render() {
        return <div className='app'>
            <div className='open-member-center-button' role='button' onClick={this.showMemberCenter}>
                使用者中心
            </div>
            <PbplusMemberCenter.Container />
        </div>;
    }
}

export default App;
