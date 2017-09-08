// PersonalData.js
'use strict';
import 'isomorphic-fetch';
import { PERSONAL_DATA_BASE_URL } from './BaseUrl.js';
import PictureEditor from './PictureEditor.js';
import { trimObject } from './Utils.js';

const defaultState = {
    name: '', gender: '',
    birthYear: '', birthMonth: '', birthDay: '',
    country: '', mobile: '',
    mobileVerifyCode: '',
    email: '',
    zipcode: '', address: '',
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
            name, gender,
            birth_year: birthYear, birth_month: birthMonth, birth_day: birthDay,
            country, mobile, email,
            zipcode, address
        } = response.message;
        const newValueMap = trimObject({
            name, gender,
            birthYear, birthMonth, birthDay,
            country, mobile, email,
            zipcode, address
        });
        dispatch(updateValue({ newValueMap }));
        if(src) { dispatch(PictureEditor.Actions.updateImageSource(src)); }
    })
    .catch(error => { console.log(error); });
}; };

const submit = ({
    photo, name, gender,
    birthYear, birthMonth, birthDay,
    country, mobile, mobileVerifyCode,
    email, zipcode, address
}) => { return (dispatch, getState) => {
    const { userUuid: uuid } = getState().pbplusMemberCenter;
    const putData = Object.assign({ uuid }, {
        birthday: `${birthYear}-${birthMonth}-${birthDay}`,
        picture: photo,
        name, gender,
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
        console.log('response:', response);
    })
    .catch(error => { console.log(error); });
}; };

const Actions = { updateValue, fetchData, submit };

export default { Reducer, Actions };
