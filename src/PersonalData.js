// PersonalData.js
'use strict';
import 'isomorphic-fetch';
import { PERSONAL_DATA_BASE_URL, FILL_EMAIL_BASE_URL } from './BaseUrl.js';
import PictureEditor from './PictureEditor.js';
import { trimObject } from './Utils.js';

const defaultState = {
    name: '', nickname: '', gender: '',
    birthYear: '', birthMonth: '', birthDay: '',
    country: '', mobile: '',
    mobileVerifyCode: '',
    email: '', isEmailValidated: false,
    zipcode: '', address: '',
    submitResult: {isSuccess: undefined, message: ''},
};

const Reducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'UPDATE_PBPLUS_PERSONAL_DATA_VALUE':
            return Object.assign({}, state, action.payload);
            break;
        default:
            return state;
    }
}

const updateValue = ({ newValueMap }) => {
    return {type: 'UPDATE_PBPLUS_PERSONAL_DATA_VALUE', payload: newValueMap};
};

const fetchData = () => { return (dispatch, getState) => {
    const { userUuid: uuid } = getState().pbplusMemberCenter;
    fetch(`${PERSONAL_DATA_BASE_URL}`, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ uuid })
    })
    .then(response => {
        if(response.status >= 400) { throw new Error('Bad response from server'); }
        return response.json();
    })
    .then(response => {
        const {
            src,
            name, nickname, gender,
            birth_year: birthYear, birth_month: birthMonth, birth_day: birthDay,
            country, mobile, email,
            zipcode, address
        } = response.message;
        const newValueMap = trimObject({
            name, nickname, gender,
            birthYear, birthMonth, birthDay,
            country, mobile, email,
            zipcode, address,
            isEmailValidated: !!email,
        });
        dispatch(updateValue({ newValueMap }));
        if(src) { dispatch(PictureEditor.Actions.updateImageSource(src)); }
    })
    .catch(error => { console.log(error); });
}; };

const validateEmail = ({ email }) => { return (dispatch, getState) => {
    const { userUuid: uuid } = getState().pbplusMemberCenter;
    const putData = { uuid, email };
    fetch(FILL_EMAIL_BASE_URL, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(putData)
    })
    .then(response => {
        if(response.status >= 400) { throw new Error('Bad response from server'); }
        return response.json();
    })
    .then(response => {
        const isSuccess = 200 === response.status;
        dispatch(updateValue({newValueMap: {submitResult: { isSuccess, message: response.message}}}));
        setTimeout(() => {
            dispatch(updateValue({newValueMap: {submitResult: {isSuccess: undefined, message: ''}}}));
        }, 6000);
    })
    .catch(error => {
        dispatch(updateValue({newValueMap: {submitResult: {isSuccess: false, message: '內部錯誤，請稍後再試。'}}}));
        setTimeout(() => {
            dispatch(updateValue({newValueMap: {submitResult: {isSuccess: undefined, message: ''}}}));
        }, 6000);
    });
}; };

const submit = ({
    photo, nickname, name, gender,
    birthYear, birthMonth, birthDay,
    country, mobile, mobileVerifyCode,
    email, zipcode, address
}) => { return (dispatch, getState) => {
    const { userUuid: uuid } = getState().pbplusMemberCenter;
    const putData = Object.assign({ uuid }, {
        birthday: `${birthYear}-${birthMonth}-${birthDay}`,
        picture: photo,
        nickname, name, gender,
        country, mobile, mobileVerifyCode,
        email, zipcode, address
    });
    fetch(`${PERSONAL_DATA_BASE_URL}/edit`, {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(putData)
    })
    .then(response => {
        if(response.status >= 400) { throw new Error('Bad response from server'); }
        return response.json();
    })
    .then(response => {
        if(200 === response.status) {
            dispatch(updateValue({newValueMap: {submitResult: {isSuccess: true, message: '更新成功。'}}}));
            setTimeout(() => {
                dispatch(updateValue({newValueMap: {submitResult: {isSuccess: undefined, message: ''}}}));
            }, 6000);
        } else {
            dispatch(updateValue({newValueMap: {submitResult: {isSuccess: false, message: '更新失敗。'}}}));
            setTimeout(() => {
                dispatch(updateValue({newValueMap: {submitResult: {isSuccess: undefined, message: ''}}}));
            }, 6000);
        }
    })
    .catch(error => {
        dispatch(updateValue({newValueMap: {submitResult: {isSuccess: false, message: '更新失敗。'}}}));
        setTimeout(() => {
            dispatch(updateValue({newValueMap: {submitResult: {isSuccess: undefined, message: ''}}}));
        }, 6000);
    });
}; };

const Actions = { updateValue, fetchData, submit, validateEmail };

export default { Reducer, Actions };
