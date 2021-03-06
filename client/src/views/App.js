// Packages
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Bootstrap
import Toast from 'react-bootstrap/Toast';

// Custom
import Home from './Home';
import Login from './Login';
import Members from './Members';
import PointsLog from './PointsLog';
import EditMembers from './EditMembers';
import Profile from './Profile';
import ForgotPassword from './ForgotPassword';
import actions from '../redux/auth/actions';
import toastActions from '../redux/toast/actions';

function App(props) {

  useEffect(() => {
    // Checks to see if there is a saved token from another session
    // and attempts to reauthenticate without logging in
    if (localStorage.getItem('token') && !props.isLoading && !props.isAuthenticated) {
      props.validate();
    }

    // Set the background gradient colors to the KTP official colors if not already set
    let bodyElem = document.body;
    let hasColor1 = bodyElem.style.getPropertyValue('--prof-col1') !== '';
    let hasColor2 = bodyElem.style.getPropertyValue('--prof-col2') !== '';
    
    if (!hasColor1 && !hasColor2) {
      bodyElem.style.setProperty('--prof-color1', '#28B463');
      bodyElem.style.setProperty('--prof-color2', '#145BBD');
    }
  });

  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/login' component={Login} />
        <Route path='/members' component={Members} />
        <Route path='/points' component={PointsLog} />
        <Route path='/edit-members' component={EditMembers} />
        <Route path='/profile/:id' component={Profile} />
        <Route path='/forgot-password' component={ForgotPassword} />
      </Switch>
      {/* Toast Put Here To Stay Visible Across Page Changes */}
      <Toast
        className='ktp-toast'
        show={props.toast.visible}
        onClose={props.clearToast}
        style={{ backgroundColor: props.toast.color }}
        delay={3000}
        autohide
      >
        <Toast.Body>
          { props.toast.msg }
        </Toast.Body>
      </Toast>
    </Router>
  );
}

// Mapping Redux State to Component Props
const mapStateToProps = state => ({
  token: state.auth.token,
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
  toast: state.toast,
});

// Mapping Redux Action Creators to Component Prop Functions
const mapDispatchToProps = dispatch => ({
  validate: () => dispatch(actions.validate()),
  clearToast: () => dispatch(toastActions.clear()),
});

// Connects Redux and Redux Mappings to Component
export default connect(mapStateToProps, mapDispatchToProps)(App);