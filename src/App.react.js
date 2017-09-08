// App.react.js
import { connect } from 'react-redux';
import React from 'react';
import Calendar from './Calendar.js';
import MemberCenter from './MemberCenter.js';
import PersonalData from './PersonalData.js';
import PictureEditor from './PictureEditor.js';
// import { PbplusMemberCenter, PbplusCalendar, PbplusPersonalData } from 'pbplus-member-ui';
import {
    PbplusMemberCenter, PbplusCalendar, PbplusPersonalData, PbplusImageInputBox
} from '../../../../src/js/index.js';
import '../css/app.less';

const ConnectedPbplusMemberCenter = connect(
    (state, ownProps) => { return {
        displayState: state.pbplusMemberCenter.displayState,
    }; },
    (dispatch, ownProps) => { return {
        hide: () => {
            dispatch(MemberCenter.Actions.updateDisplayState({displayState: 'hiding'}));
            setTimeout(() => { dispatch(MemberCenter.Actions.updateDisplayState({displayState: 'hidden'})); }, 600);
        },
    }; }
)(PbplusMemberCenter);

const ConnectedPbplusImageInputBox = connect(
    (state, ownProps) => { return {
        editorState: state.pbplusPictureEditor,
    }; },
    (dispatch, ownProps) => { return {
        updateImageSource: (url) => { dispatch(PictureEditor.Actions.updateImageSource(url)); },
        movePicture: (move) => {
            console.log('movePicture() move:', move);
            dispatch(PictureEditor.Actions.movePicture(move));
        },
        stretchPicture: (stretch) => { dispatch(PictureEditor.Actions.stretchPicture(stretch)); },
    }; }
)(PbplusImageInputBox);

const ConnectedPbplusPersonalData = connect(
    (state, ownProps) => {
        return Object.assign({}, state.pbplusPersonalData, {
            photo: state.pbplusPictureEditor.resultSource,
            imageInputBox: <ConnectedPbplusImageInputBox />,
        });
    },
    (dispatch, ownProps) => { return {
        updateValue: ({ newValueMap }) => {
            dispatch(PersonalData.Actions.updateValue({ newValueMap }));
        },
        updateImageSource: (url) => { dispatch(PictureEditor.Actions.updateImageSource(url)); },
        submit: ({
            photo, name, gender,
            birthYear, birthMonth, birthDay,
            country, mobile, mobileVerifyCode,
            email, zipcode, address
        }) => {
            console.log(
                'submit()',
                photo, name, gender,
                birthYear, birthMonth, birthDay,
                country, mobile, mobileVerifyCode,
                email, zipcode, address
            );
        },
    }; }
)(PbplusPersonalData);

const ConnectedPbplusCalendar = connect(
    (state, ownProps) => { return Object.assign({}, state.pbplusCalendar); },
    (dispatch, ownProps) => {
        return {
            goThisMonth: () => {
                const today = new Date();
                dispatch(Calendar.Actions.updateMonth({month: today.getMonth(), year: today.getFullYear()}));
            },
            goPreviousMonth: ({ currentYear, currentMonth }) => {
                const previousMonthDate = new Date(currentYear, currentMonth - 1);
                dispatch(Calendar.Actions.updateMonth({
                    month: previousMonthDate.getMonth(),
                    year: previousMonthDate.getFullYear()
                }));
            },
            goNextMonth: ({ currentYear, currentMonth }) => {
                const nextMonthDate = new Date(currentYear, currentMonth + 1);
                dispatch(Calendar.Actions.updateMonth({
                    month: nextMonthDate.getMonth(),
                    year: nextMonthDate.getFullYear()
                }));
            },
        };
    }
)(PbplusCalendar);

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
            <ConnectedPbplusMemberCenter
                calendar={<ConnectedPbplusCalendar />}
                personalData={<ConnectedPbplusPersonalData />}
            />
        </div>;
    }
}

export default App;
