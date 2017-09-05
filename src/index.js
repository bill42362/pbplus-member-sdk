// index.js
import MemberCenter from './MemberCenter.js';
import MemberCenterContainer from './MemberCenterContainer.js';

const Actions = {
    display: MemberCenter.Actions.display,
};

export default {
    Reducer: MemberCenter.Reducer,
    Container: MemberCenterContainer,
    Actions
};
