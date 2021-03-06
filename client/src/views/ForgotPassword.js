// Packages
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

// Bootstrap
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

// Custom
import Api from '../services/KTPApi';
import toastActions from '../redux/toast/actions';
import Layout from './layouts/Layout';

const ForgotPassword = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [resetCode, setResetCode] = useState('');

  useEffect(() => {
    if (confirm !== password) {

    }
  }, [confirm, password]);

  const handleReset = e => {
    e.preventDefault();

    Api.forgotPassword({ email, reset_code: resetCode, password }).then(data => {
      if (data.success) {
        props.showToast('success', data.message);
        props.history.push('/login');
      }
    })
    .catch(err => props.showToast('error', err.response.data.err));
  }

  return (
    <div id='forgot-password'>
      <Layout>
        <div id='ktp-content'>
          <Card style={{ width: '50%', margin: '0 auto' }}>
            <Card.Header>
              Forgot Password
            </Card.Header>
            <Card.Body>
              <p>Enter your account email, and you'll receive an email with a reset code</p>
              <Form onSubmit={handleReset}>
              `<Form.Group controlId='email'>
                  <Form.Control
                    name='email'
                    type='email'
                    placeholder='Email'
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId='resetCode'>
                  <Form.Control
                    name='resetCode'
                    type='text'
                    placeholder='Reset Code'
                    onChange={e => setResetCode(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId='newPass'>
                  <Form.Control
                    name='newPass'
                    type='password'
                    placeholder='New Password'
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId='confirm'>
                  <Form.Control
                    name='confirmPass'
                    type='password'
                    placeholder='Confirm Password'
                    onChange={e => setConfirm(e.target.value)}
                    required
                  />
                </Form.Group>
                <center>
                  <Button variant='primary' type='submit'>Submit</Button>
                </center>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </Layout>
    </div>
  );
}

// Maps Redux State to Component Props
const mapDispatchToProps = dispatch => ({
  showToast: (type, msg) => dispatch(toastActions.show(type, msg)),
});

// Connects Redux and Redux Mappings to Component
export default connect(undefined, mapDispatchToProps)(withRouter(ForgotPassword));