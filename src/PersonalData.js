// PersonalData.js
'use strict';

const defaultState = {
    name: '', gendar: '',
    birthYear: '', birthMonth: '', birthDay: '',
    country: undefined, mobile: '',
    mobileVerifyCode: '',
    email: '',
    zipcode: '', address: '',
};

const Reducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'UPDATE_PERSONAL_DATA_VALUE':
            return Object.assign({}, state, action.payload);
            break;
        default:
            return state;
    }
}

const updateValue = ({ newValueMap }) => {
    return {type: 'UPDATE_PERSONAL_DATA_VALUE', payload: newValueMap};
};

const Actions = { updateValue };

export default { Reducer, Actions };
