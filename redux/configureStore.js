import { createStore, combineReducers } from 'redux';
import connectReducer from './reducers/connectReducer';

const configureStore = () => {
    return createStore(connectReducer);
}
export default configureStore;
