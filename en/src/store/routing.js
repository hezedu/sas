import { createStore, combineReducers } from 'redux';
import { routerReducer , LOCATION_CHANGE} from 'react-router-redux';

function onRouting(state = {}, action){
  switch(action.type){
  case LOCATION_CHANGE:
    return action.payload;
  default:
    return state
  }
}

const store = createStore(
  combineReducers({
    onRouting,
    routing:routerReducer
  })
);

export default store;
