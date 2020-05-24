// Packages
import React, { useState } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

// Bootstrap
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';

// Custom
import Api from '../../services/KTPApi';
import actions from '../../redux/auth/actions';
import toastActions from '../../redux/toast/actions';

function Academics(props) {
  // Component State and Constants
  const id = props.match.params.id;
  const [showModal, setShowModal] = useState(false);
  const [coursesToAdd, setCoursesToAdd] = useState('');
  const [coursesToRemove, setCoursesToRemove] = useState('');

  // Filters courses to only include ones that are in the given category
  const coursesByCat = category => {
    return props.courses.filter(course => course.split(' ')[0] === category)
      .map((course, index) => <p key={index}>{ course }</p>);
  }

  // Submits the Add Courses Form
  const addCourses = () => {
    // Convert coursesToAdd to an Array
    let courseList = coursesToAdd.split(', ');
    
    // Construct Payload Object
    let payload = {
      updates: { courses: [ ...props.member.courses, ...courseList ] },
    };

    // Call API to update the current member
    Api.updateMember(props.member._id, payload)
      .then(data => {
        if (data.success) {
          // Update Redux State
          props.loadMember(props.member._id);
          props.showToast('success', 'Course(s) Added');
        } else {
          props.showToast('error', data.error);
        }
      });
  }

  // Submits the Remove Courses Form
  const removeCourses = () => {
    // Convert coursesToRemove to an Array
    let courseList = coursesToRemove.split(', ');
    
    // Remove selected courses
    let courses = props.member.courses.filter(course => !courseList.includes(course));

    // Construct Payload Object
    let payload = {
      updates: { courses },
    };

    // Calls API to update the current member
    Api.updateMember(props.member._id, payload)
      .then(data => {
        if (data.success) {
          // Update Redux State
          props.loadMember(props.member._id);
          props.showToast('success', 'Course(s) Removed');
        } else {
          props.showToast('error', data.error);
        }
      });
  }

  // Generate a Accordion List for each course category
  let courseAccordion = props.courseCats.map((category, index) => (
    <Card key={index}>
      <Accordion.Toggle as={Card.Header} eventKey={index}>
        { category } <i className='fa fa-caret-down' style={{ float: 'right' }}></i>
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={index}>
        <Card.Body>{ coursesByCat(category) }</Card.Body>
      </Accordion.Collapse>
    </Card>
  ));

  return (
    <>
      <Col lg={12}>
        <Row className='acad-content'>
          <Col lg={5}>
            <span>Major: { props.major }</span>
          </Col>
          <Col lg={{ span: 5, offset: 2 }}>
            <span>Graduation Semester: { props.gradSemester }</span>
          </Col>
        </Row>
        <Row style={{ marginTop: 15 }}>
          <Col lg={6}>
            {props.member && props.member.email.split('@')[0] === id && (
              <Row>
                <Col lg={{ offset: 3 }}>
                  <Button
                    className='ktp-btn'
                    variant='info'
                    size='sm'
                    onClick={() => setShowModal(true)}
                  >
                    Edit Courses
                  </Button>
                </Col>
              </Row>
            )}
            <Accordion defaultActiveKey='0'>
              { courseAccordion }
            </Accordion>
          </Col>
        </Row>
      </Col>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span>Use the format: "[Course Department] [4 Digit Course Number]", and separate courses with ", "</span>
          <Form>
            <Form.Group controlId='addCourses'>
              <Form.Label>Add Course(s):</Form.Label>
              <Form.Control type='text' onChange={e => setCoursesToAdd(e.target.value)} />
            </Form.Group>
            <Button variant='outline-success' onClick={addCourses}>Add</Button>
          </Form>
          <br />
          <Form>
            <Form.Group controlId='removeCourses'>
              <Form.Label>Remove Course(s):</Form.Label>
              <Form.Control type='text' onChange={e => setCoursesToRemove(e.target.value)} />
            </Form.Group>
            <Button variant='outline-danger' onClick={removeCourses}>Remove</Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='outline-secondary' onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Maps Redux State to Component Props
const mapStateToProps = state => ({
  member: state.auth.member,
});

// Maps Redux Action Creators to Component Prop Functions
const mapDispatchToProps = dispatch => ({
  loadMember: id => dispatch(actions.loadMember(id)),
  showToast: (type, msg) => dispatch(toastActions.show(type, msg)),
});

// Connects Redux and Redux Mappings to Component
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Academics));