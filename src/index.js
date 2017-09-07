// index.js
import MemberCenter from './MemberCenter.js';
import UserUUID from './UserUUID.js';
import MemberCenterContainer from './MemberCenterContainer.js';

const Actions = {
    display: MemberCenter.Actions.display,
    updateUserUUID: UserUUID.Actions.updateUserUUID,
};

export default {
    Reducer: MemberCenter.Reducer,
    Container: MemberCenterContainer,
    Actions
};
