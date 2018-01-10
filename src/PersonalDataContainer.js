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
    (dispatch, ownProps) => {
        const { memberBaseUrl, memberCenterBaseUrl } = ownProps;
        return {
            updateValue: ({ newValueMap }) => {
                dispatch(PersonalData.Actions.updateValue({ newValueMap }));
            },
            updateImageSource: (url) => { dispatch(PictureEditor.Actions.updateImageSource(url)); },
            fetchPersonalData: () => {
                dispatch(PersonalData.Actions.fetchData({ memberCenterBaseUrl }));
                dispatch(PersonalData.Actions.fetchValidatedData({ memberBaseUrl }));
            },
            sendValidateMobileMessage: ({ country, mobile }) => {
                dispatch(PersonalData.Actions.sendValidateMobileMessage({ country, mobile, memberBaseUrl }));
            },
            submitMobileVerifyCode: ({ mobileVerifyCode }) => {
                dispatch(PersonalData.Actions.submitMobileVerifyCode({ mobileVerifyCode, memberBaseUrl }));
            },
            validateEmail: ({ email }) => {
                dispatch(PersonalData.Actions.validateEmail({ email, memberBaseUrl }));
            },
            submit: ({
                photo, nickname, name, gender,
                birthYear, birthMonth, birthDay,
                zipcode, address,
            }) => {
                dispatch(PersonalData.Actions.submit({
                    photo, nickname, name, gender,
                    birthYear, birthMonth, birthDay,
                    zipcode, address,
                }));
            },
        };
    }
)(PbplusPersonalData);

export default PersonalDataContainer;
