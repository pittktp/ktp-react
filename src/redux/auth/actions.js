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
        return err.response;
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
