// index.js
import MemberCenter from './MemberCenter.js';
import UserUUID from './UserUUID.js';
import MemberCenterContainer from './MemberCenterContainer.js';

const Actions = {
    display: MemberCenter.Actions.display,
    updateActiveTab: MemberCenter.Actions.updateActiveTab,
    updateUserUUID: UserUUID.Actions.updateUserUUID,
    renewUserUUID: UserUUID.Actions.renewUserUUID,
};

export default {
    Reducer: MemberCenter.Reducer,
    Container: MemberCenterContainer,
    Actions
};
