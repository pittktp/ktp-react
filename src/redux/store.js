import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import authReducer from './auth/reducer';
import toastReducer from './toast/reducer';

const initialState = {};

const rootReducer = combineReducers({
  auth: authReducer,
  toast: toastReducer,
});

const middleware = [thunk];

var store = null;

// Try to enable Redux Devtools if in Development environment
try {
  store = createStore(rootReducer, initialState, compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  ));
} catch (e) {
  store = createStore(rootReducer, initialState, applyMiddleware(...middleware));
}

export default store;