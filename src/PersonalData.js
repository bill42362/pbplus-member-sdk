// PersonalData.js
'use strict';
import 'isomorphic-fetch';
import PictureEditor from './PictureEditor.js';
import { trimObject } from './Utils.js';

const defaultState = {
    name: '', nickname: '', gender: '',
    birthYear: '', birthMonth: '', birthDay: '',
    country: '', mobile: '', isMobileValidated: false,
    mobileVerifyCode: '', isMobileVerifyCodeSent: false,
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

const fetchData = ({ memberCenterBaseUrl }) => { return (dispatch, getState) => {
    const { userUuid: uuid } = getState().pbplusMemberCenter;
    fetch(`${memberCenterBaseUrl}/member_data`, {
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
            zipcode, address
        } = response.message;
        const newValueMap = trimObject({
            name, nickname, gender,
            birthYear, birthMonth, birthDay,
            zipcode, address,
        });
        dispatch(updateValue({ newValueMap }));
        if(src) { dispatch(PictureEditor.Actions.updateImageSource(src)); }
    })
    .catch(error => { console.log(error); });
}; };

const fetchValidatedData = ({ memberBaseUrl }) => { return (dispatch, getState) => {
    const { userUuid: uuid } = getState().pbplusMemberCenter;
    fetch(`${memberBaseUrl}/getUserInfo`, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ uuid })
    })
    .then(response => {
        if(response.status >= 400) { throw new Error('Bad response from server'); }
        return response.json();
    })
    .then(response => {
        const { email, country_code: country, mobile } = response.message;
        const newValueMap = trimObject({
            email, country, mobile,
            isEmailValidated: !!email,
            isMobileValidated: !!country && !!mobile
        });
        dispatch(updateValue({ newValueMap }));
    })
    .catch(error => { console.log(error); });
}; };

const sendValidateMobileMessage = ({ country, mobile, memberBaseUrl }) => { return (dispatch, getState) => {
    const { userUuid: uuid } = getState().pbplusMemberCenter;
    const putData = { uuid, mobile, country };
    fetch(`${memberBaseUrl}/sendCaptcha`, {
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
        if(isSuccess) {
            dispatch(updateValue({newValueMap: {isMobileVerifyCodeSent: true}}));
        } else {
            dispatch(updateValue({newValueMap: {submitResult: {isSuccess: false, message: '傳送失敗。'}}}));
            setTimeout(() => {
                dispatch(updateValue({newValueMap: {submitResult: {isSuccess: undefined, message: ''}}}));
            }, 6000);
        }
    })
    .catch(error => {
        dispatch(updateValue({newValueMap: {submitResult: {isSuccess: false, message: '內部錯誤，請稍後再試。'}}}));
        setTimeout(() => {
            dispatch(updateValue({newValueMap: {submitResult: {isSuccess: undefined, message: ''}}}));
        }, 6000);
    });
}; };

const submitMobileVerifyCode = ({ mobileVerifyCode, memberBaseUrl }) => { return (dispatch, getState) => {
    const { userUuid: uuid } = getState().pbplusMemberCenter;
    const { mobile, country } = getState().pbplusMemberCenter.personalData;
    const putData = {
        captcha: mobileVerifyCode,
        mobile, country, uuid
    };
    fetch(`${memberBaseUrl}/verifyCaptcha`, {
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
        if(isSuccess) {
            dispatch(updateValue({newValueMap: {isMobileValidated: true}}));
            dispatch(updateValue({newValueMap: {submitResult: { isSuccess, message: '手機驗證成功'}}}));
            setTimeout(() => {
                dispatch(updateValue({newValueMap: {submitResult: {isSuccess: undefined, message: ''}}}));
            }, 6000);
        } else {
            dispatch(updateValue({newValueMap: {submitResult: { isSuccess, message: '驗證失敗，請十分鐘後再試'}}}));
            setTimeout(() => {
                dispatch(updateValue({newValueMap: {submitResult: {isSuccess: undefined, message: ''}}}));
            }, 6000);
        }
    })
    .catch(error => {
        dispatch(updateValue({newValueMap: {submitResult: {isSuccess: false, message: '內部錯誤，請稍後再試。'}}}));
        setTimeout(() => {
            dispatch(updateValue({newValueMap: {submitResult: {isSuccess: undefined, message: ''}}}));
        }, 6000);
    });
}; };

const validateEmail = ({ email, memberBaseUrl }) => { return (dispatch, getState) => {
    const { userUuid: uuid } = getState().pbplusMemberCenter;
    const putData = { uuid, email };
    fetch(`${memberBaseUrl}/fillEmail`, {
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
    zipcode, address,
    memberCenterBaseUrl
}) => { return (dispatch, getState) => {
    const { userUuid: uuid } = getState().pbplusMemberCenter;
    const putData = Object.assign({ uuid }, {
        birthday: `${birthYear}-${birthMonth}-${birthDay}`,
        picture: photo,
        nickname, name, gender,
        zipcode, address
    });
    fetch(`${memberCenterBaseUrl}/member_data/edit`, {
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

const Actions = {
    updateValue, fetchData, fetchValidatedData, submit,
    sendValidateMobileMessage, submitMobileVerifyCode,
    validateEmail
};

export default { Reducer, Actions };
