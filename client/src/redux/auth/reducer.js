// Import Action Types
import { types } from './actions';
import Api from '../../services/KTPApi';

const initialState = {
  token: localStorage.getItem('token') || null,
  isAuthenticated: false,
  isLoading: false,
  member: null
};

export default function (state = initialState, action) {
  switch (action.type) {
    case types.LOAD_MEMBER:
      return {
        ...state,
        isLoading: true,
      };
    case types.AUTH_LOADING:
    case types.AUTH_VALIDATE:
      Api.setToken(localStorage.getItem('token'));
      return {
        ...state,
        isLoading: true
      };
    case types.AUTH_VALID:
    case types.MEMBER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        member: action.payload.member,
      };
    case types.AUTH_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      Api.setToken(action.payload.token);
      return {
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        member: action.payload.member,
      };
    case types.AUTH_ERROR:
    case types.LOGOUT:
      localStorage.removeItem('token');
      return initialState;
    default:
      return state;
  }
}