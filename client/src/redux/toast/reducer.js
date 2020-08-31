// Import Action Types
import { types } from './actions';

const initialState = {
  visible: false,
  color: 'transparent',
  msg: ''
};

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