// ACTION TYPES
export const types = {
  TOAST_SUCCESS: 'TOAST_SUCCESS',
  TOAST_ERROR: 'TOAST_ERROR',
  TOAST_INFO: 'TOAST_INFO',
  TOAST_WARNING: 'TOAST_WARNING',
  TOAST_CLEAR: 'TOAST_CLEAR'
};

export const colors = {
  success: '#28a745',
  error: '#dc3545',
  info: '#17a2b8',
  warning: '#ffc107',
}

const action = (type, payload) => ({ type, payload });
const getTypeAndColor = toastType => {
  switch (toastType) {
    case 'success':
      return { type: types.TOAST_SUCCESS, color: colors.success };
    case 'error':
      return { type: types.TOAST_ERROR, color: colors.error };
    case 'info':
      return { type: types.TOAST_INFO, color: colors.info };
    case 'warning':
      return { type: types.TOAST_WARNING, color: colors.warning };
    case 'clear':
    default:
      return { type: types.TOAST_CLEAR, color: 'transparent' };
  }
};

// ACTION CREATORS
const toastActions = {
  show: (toastType, msg) => {
    return dispatch => {
      let { type, color } = getTypeAndColor(toastType);
      dispatch(action(type, { visible: true, color, msg }));
    }
  },
  clear: () => {
    return dispatch => {
      dispatch(action(types.TOAST_CLEAR, { visible: false, color: 'transparent', msg: '' }));
    }
  }
};

export default toastActions;