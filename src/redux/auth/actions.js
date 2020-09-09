// IMPORTS
import Api from '../../services/KTPApi';

// ACTION TYPES
export const types = {
  AUTH_ERROR: 'AUTH_ERROR',
  AUTH_LOADING: 'AUTH_LOADING',
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_VALID: 'AUTH_VALID',
  AUTH_VALIDATE: 'AUTH_VALIDATE',
  LOAD_MEMBER: 'LOAD_MEMBER',
  MEMBER_LOADED: 'MEMBER_LOADED',
  LOGOUT: 'LOGOUT',
};

const action = (type, payload) => ({ type, payload });

// ACTION CREATORS
// This is where the thunk middleware comes in handy.
// It allows us to make asynchronous API calls within our action creators,
// so that we can isolate the handling of our API calls from 
// our React component logic.
const actions = {
  login: (credentials) => {
    return dispatch => {
      dispatch(action(types.AUTH_LOADING, {}));
      
      return Api.login(credentials).then(data => {
        dispatch(action(types.AUTH_SUCCESS, data));
        return data;
      })
      .catch(err => {
        dispatch(action(types.AUTH_ERROR, {}));
        return err.response.data;
      });
    };
  },
  logout: () => {
    return dispatch => {
      dispatch(action(types.LOGOUT, {}));
      return true;
    };
  },
  register: (credentials) => {
    return dispatch => {
      dispatch(action(types.AUTH_LOADING, {}));

      return Api.register(credentials).then(data => {
        dispatch(action(types.AUTH_SUCCESS, data));
        return data;
      })
      .catch(err => {
        dispatch(action(types.AUTH_ERROR, {}));
        return err.response.data;
      });
    };
  },
  validate: () => {
    // Checks if there is a token in localStorage
    // If so, it contacts the API to see if the token is still
    // valid or not.
    return dispatch => {
      dispatch(action(types.AUTH_VALIDATE, {}));

      return Api.validate().then(data => {
        switch (data.result) {
          case 'valid':
            dispatch(action(types.AUTH_VALID, { member: data.member }));
            break;
          case 'refreshed':
            dispatch(action(types.AUTH_SUCCESS, { token: data.token, member: data.member }));
            break;
          default:
            dispatch(action(types.AUTH_ERROR, {}));
            break;
        }

        return data;
      })
      .catch(err => {
        dispatch(action(types.AUTH_ERROR, {}));
      });
    };
  },
  loadMember: id => {
    // If a change happens on the server that impacts the logged in user,
    // that user needs to be able to see those changes as soon as possible.
    // This function gets called whenever something happens that may affect
    // the logged in member, so they will be up-to-date at all times.
    return dispatch => {
      dispatch(action(types.LOAD_MEMBER, {}));

      return Api.loadMember(id).then(data => {
        dispatch(action(types.MEMBER_LOADED, { member: data.member }));
        return data;
      })
      .catch(err => err.response.data);
    }
  }
};

export default actions;
