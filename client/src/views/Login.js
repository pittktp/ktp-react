// Packages
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

// Bootstrap
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';

// Custom
import actions from '../redux/auth/actions';
import toastActions from '../redux/toast/actions';
import config from '../config';
import Layout from './layouts/Layout';
import '../styles/Login.css';

function Login(props) {
  // Component State and Constants
  const TAB = 'auth-tab';
  const ACTIVE_TAB = 'auth-tab-active';
  const [active, setActive] = useState('#login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirm: '',
    name: '',
    code: '',
  });

  useEffect(() => {
    // Redirect to Home if not logged in
    if (props.isAuthenticated) {
      props.history.push('/')
    }

    // Login page should always use KTP official colors
    let bodyElem = document.body;
    bodyElem.style.setProperty('--prof-color1', '#28B463');
    bodyElem.style.setProperty('--prof-color2', '#145BBD');
  }, [props.isAuthenticated, props.history]);

  // Updates Component State for onChange events
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // Submits Login Form
  const handleLogin = e => {
    // Stops Form from sending its own HTTP Request
    e.preventDefault();

    // Deconstruct formData to values we need
    const { email, password } = formData;

    // Call Redux `login` action creator
    props.login({ email, password })
      .then(data => {
        console.log(data);
        if (!data.error && data.member) {
          props.showToast('success', `Welcome, ${data.member.name}`);
          props.history.push('/');
        } else {
          props.showToast('error', data.error);
        }
      });
  }

  // Submits Registration Form
  const handleRegister = e => {
    // Prevents Form from sending its own HTTP Request
    e.preventDefault();

    // Validate Registration Code
    if (formData.code !== config.REG_CODE && formData.code !== config.REG_ADMIN_CODE) {
      props.showToast('error', 'Invalid Registration Code');
      return;
    }

    // Deconstruct formData to values we need
    const { name, email, password, code } = formData;

    // Calls Redux `register` action creator
    props.register({ name, email, password, code })
      .then(data => {
        if (!data.error) {
          props.showToast('success', `Welcome, ${data.member.name}`);
          props.history.push('/');
        } else {
          props.showToast('error', data.error);
        }
      });
  }

  // Conditional Rendering of Login/Registration Forms
  const form = (active === '#login') ? (
    <Form onSubmit={handleLogin}>
      <Form.Group controlId='loginEmail'>
        <Form.Control
          name='email'
          type='email'
          placeholder='Email'
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group controlId='loginPass'>
        <Form.Control
          name='password'
          type='password'
          placeholder='Password'
          onChange={handleChange}
          required
        />
      </Form.Group>
      <center>
        <Button variant='primary' type='submit'>Login</Button>
      </center>
      <p id='forgot-pass'>Forgot Password?</p>
    </Form>
  ) : (
    <Form onSubmit={handleRegister}>
      <Form.Group controlId='registerName'>
        <Form.Control
          name='name'
          type='text'
          placeholder='Full Name'
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group controlId='registerEmail'>
        <Form.Control
          name='email'
          type='email'
          placeholder='Email'
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group controlId='registerPassword'>
        <Form.Control
          name='password'
          type='password'
          placeholder='Password'
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group controlId='registerConfirm'>
        <Form.Control
          name='confirm'
          type='password'
          placeholder='Confirm Password'
          onChange={handleChange}
          isInvalid={formData.confirm !== formData.password}
          required
        />
        <Form.Control.Feedback type='invalid'>
          Your Passwords Must Match
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId='registerCode'>
        <Form.Control
          name='code'
          type='text'
          placeholder='Code'
          onChange={handleChange}
          required
        />
      </Form.Group>
      <center>
        <Button variant='success' type='submit'>Register Now</Button>
      </center>
    </Form>
  );

  return (
    <div id='login'>
      <Layout>
        <div id='ktp-content'>
          <Card id='auth-card'>
            <Card.Header>
              <Nav defaultActiveKey='#login' fill>
                <Nav.Item>
                  <Nav.Link
                    id='loginTab'
                    className={active === '#login' ? ACTIVE_TAB : TAB}
                    href='#login'
                    onSelect={key => setActive(key)}
                  >
                    Login
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    id='registerTab'
                    className={active === '#register' ? ACTIVE_TAB : TAB}
                    href='#register'
                    onSelect={key => setActive(key)}
                  >
                    Register
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
            <Card.Body style={{ paddingBottom: '0px', marginBottom: '0px' }}>
              {form}
            </Card.Body>
          </Card>
        </div>
      </Layout>
    </div>
  );
}

// Maps Redux State to Component Props
const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

// Maps Redux Action Creators to Component Prop Functions
const mapDispatchToProps = dispatch => ({
  login: (credentials) => dispatch(actions.login(credentials)),
  register: (credentials) => dispatch(actions.register(credentials)),
  showToast: (type, msg) => dispatch(toastActions.show(type, msg)),
});

// Connects Redux and Redux Mappings to Component
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));
