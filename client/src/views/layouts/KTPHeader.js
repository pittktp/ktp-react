// Packages
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

// React Bootstrap
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Table from 'react-bootstrap/Table';

// Custom
import Api from '../../services/KTPApi';
import actions from '../../redux/auth/actions';
import logo from '../../img/KtpNavLogo.png';
import '../../styles/Header.css';

function KTPHeader(props) {
  const [bg, setBg] = useState('transparent');
  const [members, setMembers] = useState([]);
  const [notHere, setNotHere] = useState([]);
  const [reloadMembers, setReloadMembers] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const navStyle = { backgroundColor: bg };
  const dividerStyle = {
    height: '100%',
    width: 2,
    borderLeft: '1px solid white',
  };

  useEffect(() => {
    // call api to get members
    if (props.isAuthenticated && reloadMembers) {
      Api.getMembers()
        .then(data => {
          setMembers(data.members);
          setReloadMembers(false);
        });
    }

    document.addEventListener('scroll', () => {
      setBg(window.scrollY < 75 ? 'transparent' : '#154360');
    })
  }, [props.isAuthenticated, reloadMembers]);

  const handleLogout = () => {
    props.logout();
    props.history.push('/');
  }

  const handleClose = () => {
    // Close Modal and Reset Data
    setShowModal(false);
    setNotHere([]);
    setReloadMembers(true);
  }

  const handleSubmit = () => {
    let payload = { absent: notHere };
    Api.sendAttendence(payload)
      .then(data => {
        if (data.result === 'success') {
          handleClose();
        }
      });
  }

  const handleNotHere = (member, index) => {
    // Add Member To Not Here List
    let membersNotHere = [ ...notHere, member._id ];
    setNotHere(membersNotHere);

    // Remove Member From Attendence List
    let members_update = [ ...members ];
    members_update.splice(index, 1);
    setMembers(members_update);
  }

  const navigate = path => {
    props.history.push(path);
  }

  let authContent = props.isAuthenticated && props.member ? (
    <NavDropdown title={props.member.name.toUpperCase()}>
      <NavDropdown.Item onClick={() => navigate(`/profile/${props.member.email.split('@')[0]}`)}>My Profile</NavDropdown.Item>
      <NavDropdown.Item onClick={() => navigate('/points')}>View/Log Points</NavDropdown.Item>
      {props.member.admin && (
        <div>
          <NavDropdown.Item onClick={() => navigate('/edit-members')}>Edit Members</NavDropdown.Item>
          <NavDropdown.Item onClick={() => setShowModal(true)}>Take Attendence</NavDropdown.Item>
        </div>
      )}
      <NavDropdown.Divider />
      <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
    </NavDropdown>
  ) : (
    <Nav.Link onClick={() => navigate('/login')}>LOGIN</Nav.Link>
  );

  let attendenceTable = props.member && props.member.admin && (
    <Table size="sm" hover bordered>
      <thead>
        <tr style={{ color: 'black' }}>
          <th>Name</th>
          <th>Present?</th>
        </tr>
      </thead>
      <tbody>
        {members.filter(member => !notHere.includes(member) && member.role !== 'Alumni' && member.role !== 'Inactive')
          .map((member, index) => (
            <tr key={member._id} style={{ color: 'black' }}>
              <td>{ member.name }</td>
              <td>
                <Button variant='outline-danger' onClick={() => handleNotHere(member, index)}>Not Here</Button>
              </td>
            </tr> 
          )
        )}
      </tbody>
    </Table>
  );

  // NOTE: href is used for in-page jumps, onClick navigate is for page changes
  return (
    <>
      <Navbar id='override' collapseOnSelect expand='lg' variant='dark' fixed='top' style={navStyle}>
        <Navbar.Brand onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <img src={logo} alt='Kappa Theta Pi Logo' />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='ktp-nav-collapse' style={{ padding: '4px' }}/>
        <Navbar.Collapse id='ktp-nav-collapse' className='justify-content-end'>
          <Nav activeKey='/'>
            <Nav.Item className='nav-item'>
              <Nav.Link href='/#rush'>RUSH</Nav.Link>
            </Nav.Item>
            <Nav.Item className='nav-item'>
              <Nav.Link href='/#mission'>MISSION</Nav.Link>
            </Nav.Item>
            <Nav.Item className='nav-item'>
              <Nav.Link href='/#contact'>CONTACT</Nav.Link>
            </Nav.Item>
            <Nav.Item className='nav-item'>
              <Nav.Link onClick={() => navigate('/members')}>MEMBERS</Nav.Link>
            </Nav.Item>
            <Nav.Item className='nav-item'>
              <div style={dividerStyle}></div>
            </Nav.Item>
            <Nav.Item className='nav-item'>
              {authContent}
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Modal show={showModal} onHide={handleClose} style={{ color: 'black' }}>
        <Modal.Header closeButton>
          <Modal.Title>Attendence</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {attendenceTable}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='outline-secondary' style={{ marginRight: 8 }} onClick={handleClose}>Close</Button>
          <Button type='submit' onClick={handleSubmit}>Confirm</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  member: state.auth.member,
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(actions.logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(KTPHeader));