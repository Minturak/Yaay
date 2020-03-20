import { createStore, combineReducers } from 'redux';
import connectReducer from './reducers/connectReducer';

const rootReducer = combineReducers(
    {
      user: connectReducer,
    }
);
const configureStore = () => {
    return createStore(rootReducer);
}
export default configureStore;
