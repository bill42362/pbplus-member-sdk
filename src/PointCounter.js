// PointCounter.js
'use strict';
import 'isomorphic-fetch';
import PersonalData from './PersonalData.js';

const noticeOfRewardTypes = {
    virtual: {
        title: '折扣兌換注意事項',
        contents: [
            {
                content: '每次申請需以3000點為一個單位，當您累積至3000點時，即可申請50元的折扣代碼，'
                    + '6000點即可申請100 元的折扣代碼。每一元都好超值!'
            },
        ],
    },
    real: {
        title: '超值兌物注意事項',
        contents: [
            {content: '超值兌換後，除因商品具有瑕疵外，一律不受理退換。'},
            {
                content: '兌換商品皆為限量，以申請先後順序排定，請隨時關注時效性。'
                    + '會員不得在活動結束後或數量發送完畢後，堅持兌換該項商品。'
            },
            {content: 'Pb+ 得保留修正、暫停與終止本紅利制度之權利。'},
        ],
    },
};
const defaultState = {
    points: 0,
    pointsLastRenewDate: new Date(),
    usingRewardType: 'real',
    usingNotice: noticeOfRewardTypes.real,
    rewards: [],
    isNoticeChecked: false,
    receiverInfo: {
        name: '', country: '', mobile: '', zipcode: '', address: '',
    },
};
const getRewardTemplate = () => ({
    id: 0, name: 'reward_template', link: '#',
    rewardValue: 50, pointCost: 3000,
    total: 5, type: 'virtual',
    selectedCount: 0,
});

const Reducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'UPDATE_PBPLUS_PERSONAL_DATA_VALUE':
            const newValueMap = action.payload;
            const { name, country, mobile, zipcode, address } = state.receiverInfo;
            const newReceiverInfo = {
                name: name || newValueMap.name,
                country: country || newValueMap.country,
                mobile: mobile || newValueMap.mobile,
                zipcode: zipcode || newValueMap.zipcode,
                address: address || newValueMap.address,
            };
            return Object.assign({}, state, {receiverInfo: newReceiverInfo});
            break;
        case 'UPDATE_PBPLUS_USING_REWARD_TYPE':
            return Object.assign({}, state, {
                usingRewardType: action.payload.usingRewardType,
                usingNotice: noticeOfRewardTypes[action.payload.usingRewardType] || noticeOfRewardTypes.virtual,
                isNoticeChecked: false,
            });
            break;
        case 'UPDATE_PBPLUS_REWARD_LIST':
            return Object.assign({}, state, {rewards: action.payload.rewards});
            break;
        case 'UPDATE_PBPLUS_REWARD_SELECT_COUNT':
            return Object.assign({}, state, {
                rewards: state.rewards.map(reward => {
                    if(action.payload.id === reward.id) {
                        return Object.assign({}, reward, {selectedCount: action.payload.count});
                    } else {
                        return reward;
                    }
                })
            });
            break;
        case 'UPDATE_PBPLUS_POINT_COUNT':
            return Object.assign({}, state, action.payload);
            break;
        case 'UPDATE_PBPLUS_IS_NOTICE_CHECKED':
            return Object.assign({}, state, {isNoticeChecked: action.payload.isNoticeChecked});
            break;
        case 'UPDATE_PBPLUS_RECEIVER_INFO':
            return Object.assign(
                {},
                state,
                {receiverInfo: Object.assign({}, state.receiverInfo, action.payload.newValueMap)}
            );
            break;
        default:
            return state;
    }
}

const updatePointCount = ({ points, pointsLastRenewDate }) => {
    return {type: 'UPDATE_PBPLUS_POINT_COUNT', payload: { points, pointsLastRenewDate }};
};

const updateRewardList = ({ rewards }) => {
    return {type: 'UPDATE_PBPLUS_REWARD_LIST', payload: {
        rewards: rewards.map(reward => Object.assign({}, getRewardTemplate(), reward)),
    }};
};

const updateRewardSelectCount = ({ id, count }) => {
    return {type: 'UPDATE_PBPLUS_REWARD_SELECT_COUNT', payload: { id, count }};
};

const updateIsNoticeChecked = ({ isNoticeChecked }) => {
    return {type: 'UPDATE_PBPLUS_IS_NOTICE_CHECKED', payload: { isNoticeChecked }};
};

const fetchPoints = () => { return (dispatch, getState) => {
    const { userUuid: uuid } = getState().pbplusMemberCenter;
    const { memberCenter: memberCenterBaseUrl } = getState().pbplusMemberCenter.baseUrl;
    fetch(`${memberCenterBaseUrl}/points`, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ uuid })
    })
    .then(response => {
        if(response.status >= 400) { throw new Error('Bad response from server'); }
        return response.json();
    })
    .then(response => {
        if(200 === response.status) {
            const { points, pointsLastRenewDate: pointsLastRenewDateString } = response.message;
            dispatch(updatePointCount({
                pointsLastRenewDate: pointsLastRenewDateString ? new Date(pointsLastRenewDateString) : new Date(),
                points,
            }));
        }
        else { throw new Error('Bad response from server'); }
    })
    .catch(error => { console.log(error); });
}; };

const fetchRewardList = () => { return (dispatch, getState) => {
    const { memberCenter: memberCenterBaseUrl } = getState().pbplusMemberCenter.baseUrl;
    fetch(`${memberCenterBaseUrl}/points/reward_list`, {method: 'get'})
    .then(response => {
        if(response.status >= 400) { throw new Error('Bad response from server'); }
        return response.json();
    })
    .then(response => {
        const { virtual, entity } = response.message;
        const rewards = [ ...virtual, ...entity ].map(reward => {
            return {
                id: reward.id,
                name: reward.name,
                rewardValue: reward.reward_value,
                pointCost: reward.points,
                total: reward.total || 0,
                type: 'virtual' === reward.type ? 'virtual' : 'real',
                link: reward.link,
            };
        });
        dispatch(updateRewardList({ rewards }));
    })
    .catch(error => { console.log(error); });
}; };

const fetchPersonalData = () => { return (dispatch, getState) => {
    const { name, country, mobile, zipcode, address } = getState().pbplusMemberCenter.pointCounter.receiverInfo;
    if(!name) { dispatch(PersonalData.Actions.fetchData()); }
    if(!country || !mobile || !zipcode || !address) {
        dispatch(PersonalData.Actions.fetchValidatedData());
    }
}; };

const updateReceiverInfo = ({ newValueMap }) => { return (dispatch, getState) => {
    return dispatch({type: 'UPDATE_PBPLUS_RECEIVER_INFO', payload: { newValueMap }});
}; };

const updateUsingRewardType = ({ usingRewardType }) => { return (dispatch, getState) => {
    return dispatch({type: 'UPDATE_PBPLUS_USING_REWARD_TYPE', payload: { usingRewardType }});
}; };

const submit = ({ orders }) => { return (dispatch, getState) => {
    const { userUuid: uuid } = getState().pbplusMemberCenter;
    const { memberCenter: memberCenterBaseUrl } = getState().pbplusMemberCenter.baseUrl;
    const { usingRewardType } = getState().pbplusMemberCenter.pointCounter;
    const { name, country, mobile, zipcode, address } = getState().pbplusMemberCenter.pointCounter.receiverInfo;
    const putDataTemplate = { uuid };
    return Promise.all(orders.map(order => {
        let putData = Object.assign({}, putDataTemplate, {
            item_id: order.id, amount: order.selectedCount
        });
        if('real' === usingRewardType) {
            putData = Object.assign({}, putData, {
                phone: `+${country}-${mobile}`,
                name, zipcode, address,
            });
        }
        return fetch(`${memberCenterBaseUrl}/points/exchange`, {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(putData)
        });
    }))
    .then(responses => {
        const someFetchingHasError = !!responses.filter(response => response.status >= 400)[0];
        if(someFetchingHasError) { throw new Error('Bad response from server'); }
        return Promise.all(responses.map(response => response.json()));
    })
    .then(responses => {
        orders.forEach(order => dispatch(updateRewardSelectCount({id: order.id, count: 0})));
        return dispatch(fetchPoints());
    })
    .catch(error => { alert(
        '您的兌換過程出了一些問題，請與客服中心聯絡，並提供您的姓名及電話，我們會用最快的速度回覆你喔! '
        + '造成您的不便，敬請見諒'
    ); });
}; };

const Actions = {
    updatePointCount, updateUsingRewardType, updateIsNoticeChecked,
    fetchRewardList, updateRewardSelectCount, updateReceiverInfo,
    submit, fetchPoints, fetchPersonalData
};

export default { Reducer, Actions };
