import { createStore } from 'redux';
let state;
try{
  JSON.parse(sessionStorage.user);
  state = JSON.parse(sessionStorage.user);
}catch(e){
  state = null;
}

const userReducer = (state, action) => {
  switch (action.type) {
  case 'login':
    sessionStorage.user = JSON.stringify(action.data);
    return action.data;
  case 'logout':
    sessionStorage.user = null;
    return null;
  default:
    return state;
  }
};
export default createStore(userReducer, state);
