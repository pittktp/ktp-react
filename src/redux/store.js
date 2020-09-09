// Importing Packages
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

// Importing our custom reducers
import authReducer from './auth/reducer';
import toastReducer from './toast/reducer';

// Redux state when you first load the site
const initialState = {};

// Combines multiple reducers into a single object in the store
// so you can access any of their values from one object/one Redux call
const rootReducer = combineReducers({
  auth: authReducer,
  toast: toastReducer,
});

// The thunk middleware allows us to create asynchronous Action Creators
// for our Redux store. This is important since almost every change that happens
// on the site requires interacting with our server and changing data in our DB.
const middleware = [thunk];

var store = null;

// Try to enable Redux Devtools if in Development environment
// Using a try/catch to default into development mode if you have the proper
// browser extension installed
try {
  store = createStore(rootReducer, initialState, compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  ));
} catch (e) {
  store = createStore(rootReducer, initialState, applyMiddleware(...middleware));
}

// Exporting the store so we can use it in other files
export default store;