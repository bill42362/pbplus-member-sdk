// index.js
import MemberCenter from './MemberCenter.js';

const Actions = {
    display: MemberCenter.Actions.display,
};

export default {
    Reducer: MemberCenter.Reducer,
    Actions
};
