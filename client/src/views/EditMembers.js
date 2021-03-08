// Packages
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

// Bootstrap
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

// Custom
import Api from '../services/KTPApi';
import Layout from './layouts/Layout';
import actions from '../redux/auth/actions';
import toastActions from '../redux/toast/actions';
import '../styles/EditMember.css';

function EditMembers(props) {
  // Component State
  const [members, setMembers] = useState([]);
  const [shouldUpdate, setShouldUpdate] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    serviceHours: 0,
    points: 0,
    absences: 0,
    role: '',
  });

  useEffect(() => {
    // Redirect to homepage if not logged in
    if ((!props.member && !props.isLoading) || !props.member.admin) {
      props.history.push('/');
    }

    // Calls API to get all KTP members
    // Uses `shouldUpdate` to prevent excess API calls
    if (shouldUpdate) {
      Api.getMembers().then(data => {
        setMembers(data.members.filter(mem => mem.role !== 'Inactive' && mem.role !== 'Alumni'));
        setShouldUpdate(false);
      });
    }
  });

  // Handles resetting the DB for a new Semester
  const zeroDB = () => {
    Api.zeroDB().then(data => {
      if (data.success) {
        setShouldUpdate(true);
      }
    });
  }

  // Handles selecting a member to edit
  const handleClick = member => {
    setSelected(member);
    setFormData({
      ...formData,
      name: member.name,
      role: member.role,
      serviceHours: member.serviceHours,
      points: member.points,
      absences: member.absences,
    });
    setShowModal(true);
  }

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // Handles Deleting a Member
  const handleDeleteMember = () => {
    if (selected._id === props.member._id) {
      props.showToast('warning', 'You can\'t delete yourself');
      return;
    }
    
    Api.deleteMember(selected._id).then(data => {
      if (data.success) {
        props.showToast('success', 'Member Deleted');
        setShouldUpdate(true);
        setShowModal(false);
      } else {
        props.showToast('error', data.error);
      }
    });
  }

  // Submits Edit Member Form
  const handleSubmit = () => {
    Api.updateMember(selected._id, { updates: formData })
      .then(data => {
        if (data.success) {
          if (selected._id === props.member._id) {
            props.loadMember();
          }
          props.showToast('success', 'Member Updated');
          setShouldUpdate(true);
          setShowModal(false);
        } else {
          props.showToast('error', data.error);
        }
      });
  }

  // Only render editMemberForm is a member has been selected
  let editMemberForm = selected && (
    <Form>
      <Form.Group controlId='memberName'>
        <Form.Label>Name</Form.Label>
        <Form.Control
          name='name'
          type='text'
          defaultValue={selected.name}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group controlId='memberHours'>
        <Form.Label>Service Hours</Form.Label>
        <Form.Control
          name='serviceHours'
          type='number'
          min={0}
          defaultValue={selected.serviceHours}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group controlId='memberPoints'>
        <Form.Label>Brotherhood Points</Form.Label>
        <Form.Control
          name='points'
          type='number'
          min={0}
          defaultValue={selected.points}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group controlId='memberAbsences'>
        <Form.Label>Absences</Form.Label>
        <Form.Control
          name='absences'
          type='number'
          min={0}
          defaultValue={selected.absences}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group controlId='memberRole'>
        <Form.Label>Select User Role:</Form.Label>
        <Form.Control
          as='select'
          name='role'
          defaultValue={selected.role}
          onChange={handleChange}
        >
          <option>Inactive</option>
          <option>Brother</option>
          <option>Alumni</option>
          <option>Business Chair</option>
          <option>Public Relations Chair</option>
          <option>Recruitment Chair</option>
          <option>Technology Chair</option>
          <option>Vice President</option>
          <option>President</option>
        </Form.Control>
      </Form.Group>
    </Form>
  );

  return (
    <div id='edit-members'>
      <Layout>
        <div id='ktp-content'>
          <Container>
            <Col xs={12}>
              <Row>
                <div className='col-xs-20 text-center' style={{ margin: '0 auto'}}>
                  <Button
                    variant='info'
                    size='sm'
                    onClick={zeroDB}
                    data-toggle='tooltip'
                    data-placement='top'
                    title='Clear all hours, points, and absences for each member'
                  >
                    Zero Database
                  </Button>
                </div>
              </Row>
              <Col xs={8}>
                <h2 style={{ color: 'white' }}>Edit Members</h2>
              </Col>
              <Row style={{ overflowX: 'scroll' }}>
                <Table size='sm' hover bordered>
                  <thead>
                    <tr>
                      <td>Name</td>
                      <td>Email</td>
                      <td>Brotherhood Points</td>
                      <td>Service Hours</td>
                      <td>Unexcused Absences</td>
                      <td>Role</td>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map(member => (
                      <tr id='edit-members-row' key={member._id} onClick={() => handleClick(member)}>
                        <td>{ member.name }</td>
                        <td>{ member.email }</td>
                        <td>{ member.points }</td>
                        <td>{ member.serviceHours }</td>
                        <td>{ member.absences }</td>
                        <td>{ member.role }</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Row>
            </Col>
          </Container>
          {/* Edit Member Modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Member</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {editMemberForm}
            </Modal.Body>
            <Modal.Footer id='edit-members-modal-footer'>
              {/* <Row> */}
                <Col xs={5}>
                  <Button variant='danger' onClick={handleDeleteMember}>Delete</Button>
                </Col>
                <Col xs={7}>
                  <Row>
                    <Button
                      className='edit-members-btn mr-2'
                      variant='outline-secondary'
                      style={{ marginRight: 0 }}
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </Button>
                    <Button className='edit-members-btn' type='submit' onClick={handleSubmit}>Confirm</Button>
                  </Row>
                </Col>
              {/* </Row> */}
            </Modal.Footer>
          </Modal>
        </div>
      </Layout>
    </div>
  );
}

// Map Redux State to Component Props
const mapStateToProps = state => ({
  isLoading: state.auth.isLoading,
  member: state.auth.member,
});

// Map Redux Action Creators to Component Prop Functions
const mapDispatchToProps = dispatch => ({
  loadMember: id => dispatch(actions.loadMember(id)),
  showToast: (type, msg) => dispatch(toastActions.show(type, msg)),
});

// Connects Redux and Redux Mappings to Component
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EditMembers));