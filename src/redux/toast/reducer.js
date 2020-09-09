// Import Action Types
import { types } from './actions';

// Initial state of the toast object in the Redux store
const initialState = {
  visible: false,
  color: 'transparent',
  msg: ''
};

// This is our reducer function which takes in our current state
// and an action and determines how the current state should change/
// be updated.
export default function (state = initialState, action) {
  switch (action.type) {
    case types.TOAST_SUCCESS:
    case types.TOAST_ERROR:
    case types.TOAST_INFO:
    case types.TOAST_WARNING:
      return action.payload;
    case types.TOAST_CLEAR:
      return initialState;
    default:
      return state;
  }
}