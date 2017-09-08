// PersonalDataContainer.react.js
import { connect } from 'react-redux';
import React from 'react';
import PersonalData from './PersonalData.js';
import PictureEditor from './PictureEditor.js';
import ImageInputBoxContainer from './ImageInputBoxContainer.js';
import { PbplusPersonalData } from 'pbplus-member-ui';

const PersonalDataContainer = connect(
    (state, ownProps) => {
        return Object.assign({}, state.pbplusMemberCenter.personalData, {
            photo: state.pbplusMemberCenter.pictureEditor.resultSource,
            imageInputBox: <ImageInputBoxContainer />,
        });
    },
    (dispatch, ownProps) => { return {
        updateValue: ({ newValueMap }) => {
            dispatch(PersonalData.Actions.updateValue({ newValueMap }));
        },
        updateImageSource: (url) => { dispatch(PictureEditor.Actions.updateImageSource(url)); },
        fetchPersonalData: () => { dispatch(PersonalData.Actions.fetchData()); },
        submit: ({
            photo, name, gender,
            birthYear, birthMonth, birthDay,
            country, mobile, mobileVerifyCode,
            email, zipcode, address
        }) => {
            dispatch(PersonalData.Actions.submit({
                photo, name, gender,
                birthYear, birthMonth, birthDay,
                country, mobile, mobileVerifyCode,
                email, zipcode, address
            }));
        },
    }; }
)(PbplusPersonalData);

export default PersonalDataContainer;
