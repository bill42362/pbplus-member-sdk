# pbplus-member-sdk
API sdk of PBPlus member plugin.

## Behaviors ##
* Update `getState().pbplusMemberCenter.userUuid` by url (token_id) or cookie.
* Dock to pbplus `auth`, `member` and `memberCenter` api, with url passed by store.

## You can ##
* Display member center by `dispatch(PbplusMemberCenter.Actions.display())`.
* Update active tab by `dispatch(PbplusMemberCenter.Actions.updateActiveTab('TAB_NAME'))`.
  - Possible `TAB_NAME`s are `notice-center`, `calendar`, `point-counter`, `buying-logs` and `personal-data`.
  - See [MemberCenterComonent](https://bitbucket.org/pbplus/pbplus-member-ui/src/7598548195277d6a740f395e19b1e48a501f4bb9/src/js/PbplusMemberCenter.react.js?at=master&fileviewer=file-view-default) for furtuer information.
* Check auth state by `dispatch(PbplusMemberCenter.Actions.checkAuthState({ clientId }))`.
* Update user uuid in cookie and store by `dispatch(PbplusMemberCenter.Actions.updateUserUUID({ uuid }))`.
* Renew user uuid in cookie and store randomly by `dispatch(PbplusMemberCenter.Actions.renewUserUUID())`.

## These values in redux store will be read. ##
```js
const store = createStore(
    reducer,
    {   
        pbplusMemberCenter: {
            baseUrl: {
                auth: process.env.AUTH_BASE_URL,
                member: process.env.MEMBER_BASE_URL,
                memberCenter: process.env.MEMBER_CENTER_BASE_URL,
            }   
        }  
    }
);
```

## Start demo server ##
```sh
cd demo/
npm install
npm start
```
