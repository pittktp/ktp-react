// Packages
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

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

function PointsLog(props) {
  // Component State
  const [members, setMembers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [shouldUpdate, setShouldUpdate] = useState(true);
  const [roleFilter, setRoleFilter] = useState('Active');

  // Modal Visibility
  const [showExcusedModal, setShowExcusedModal] = useState(false);
  const [showHoursModal, setShowHoursModal] = useState(false);
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Modal State
  const [excuseData, setExcuseData] = useState({ date: moment().format('YYYY-MM-DD'), description: '' });
  const [hoursData, setHoursData] = useState({ serviceHours: 1, description: '' });
  const [pointsData, setPointsData] = useState({ points: 1, description: '' });
  const [historyData, setHistoryData] = useState({ memberName: null, history: [] });

  useEffect(() => {
    // Redirect if not authenticated
    if (!props.member && !props.isLoading) {
      props.history.push('/');
    }

    // Run API calls in parallel
    // `shouldUpdate` used to prevent extra API calls
    if (shouldUpdate) {
      Api.getMembers()
        .then(data => setMembers(data.members));

      Api.getRequests()
        .then(data => setRequests(data.requests));
      
      setShouldUpdate(false);
    }
  }, [props, shouldUpdate]);

  // Handles filtering members by role
  const handleFilter = member => {
    switch (roleFilter) {
      case 'Active':
        return member.role !== 'Invactive' && member.role !== 'Alumni';
      case 'Inactive':
        return member.role === 'Inactive';
      case 'Alumni':
        return member.role === 'Alumni';
      default:
        return true;
    }
  }

  // Closes History Modal and Clears its State
  const closeHistory = () => {
    setHistoryData({ memberName: null, history: [] });
    setShowHistoryModal(false);
  }

  // Filters requests to create a request history for a given user
  // Sets History Modal and Data State
  const showHistory = memberName => {
    let history = requests.filter(req => req.submittedBy === memberName && req.approved === 1);
    setHistoryData({ memberName, history });
    setShowHistoryModal(true);
  }

  // Submit Brotherhood Points Form
  const submitPoints = e => {
    // Prevent form from sending its own HTTP request
    e.preventDefault();

    // Deconstruct fields from pointsData
    const { points, description } = pointsData;
    // Construct payload object
    let payload = {
      type: 'Brotherhood Points',
      value: points,
      description,
      submittedBy: props.member.name,
      submittedById: props.member._id,
      submittedDate: moment().format('MM-DD-YYYY'),
      approved: 0,
    };

    // Call API to create the request
    Api.createRequest(payload)
      .then(data => {
        if (data.success) {
          setRequests([...requests, data.request]);
          setShowPointsModal(false);
          props.showToast('success', 'Request Created');
        } else {
          props.showToast('error', data.error);
        }
      });
  }

  // Submits Service Hours Form
  const submitHours = e => {
    // Prevents form from sending its own HTTP request
    e.preventDefault();

    // Deconstruct fields from hoursData
    const { serviceHours, description } = hoursData;
    // Construt payload object
    let payload = {
      type: 'Service Hours',
      value: serviceHours,
      description,
      submittedBy: props.member.name,
      submittedById: props.member._id,
      submittedDate: moment().format('MM-DD-YYYY'),
      approved: 0
    }

    // Call API to create the request
    Api.createRequest(payload)
      .then(data => {
        if (data.success) {
          setRequests([...requests, data.request]);
          setShowHoursModal(false);
          props.showToast('success', 'Request Created');
        } else {
          props.showToast('error', data.error);
        }
      });
  }

  // Submits Excused Absence Form
  const submitExcuse = e => {
    // Prevents form from sending its own HTTP request
    e.preventDefault();

    // Deconstruct fields from excuseData
    const { date, description } = excuseData;
    // Convert date to an int for DB
    let value = parseInt(date.replace(/-/g, ''));
    // Construct payload object
    let payload = {
      type: 'Excused Absence',
      value,
      description,
      submittedBy: props.member.name,
      submittedById: props.member._id,
      submittedDate: moment().format('MM-DD-YYYY'),
      approved: 0
    };

    // Call API to create the request
    Api.createRequest(payload)
      .then(data => {
        if (data.success) {
          setRequests([...requests, data.request]);
          setShowExcusedModal(false);
          props.showToast('success', 'Request Created');
        } else {
          props.showToast('error', data.error);
        }
      });
  }

  // Handles Denying a Request
  const denyRequest = id => {
    Api.denyRequest(id)
      .then(data => {
        if (data.success) {
          props.showToast('success', 'Request Denied');
          setShouldUpdate(true);
        } else {
          props.showToast('error', data.error);
        }
      });
  }

  // Handles Accepting a Request
  const acceptRequest = id => {
    Api.acceptRequest(id, { approved: 1 })
      .then(data => {
        if (data.success) {
          props.showToast('success', 'Request Accepted');
          setShouldUpdate(true);
        } else {
          props.showToast('error', data.error);
        }
      });
  }

  // Only ender requests table if there ae pending requests
  let pendingRequests = requests.filter(req => req.approved === 0);
  let requestModalContent = pendingRequests.length > 0 ? (
    <Table size='sm' hover bordered>
      <thead>
        <tr style={{ color: 'black' }}>
          <th>Submitted By</th>
          <th>Submitted On</th>
          <th>Type</th>
          <th>Value</th>
          <th>Description</th>
          <th>Accept/Deny</th>
        </tr>
      </thead>
      <tbody>
        {pendingRequests.map(req => (
          <tr key={req._id} style={{ color: 'black' }}>
            <td
              data-toggle='tooltip'
              data-placement='top'
              title='Click for history'
              style={{ cursor: 'pointer' }}
              onClick={() => showHistory(req.submittedBy)}
            >
              { req.submittedBy }
            </td>
            <td>{ req.submittedDate }</td>
            <td>{ req.type }</td>
            {req.type === 'Excused Absence' ? (
              <td>
                { req.value.toString().substring(4, 6) }/
                { req.value.toString().substring(6, 8) }/
                { req.value.toString().substring(0, 4) }
              </td>
            ) : (
              <td>{ req.value }</td>
            )}
            <td>{ req.description }</td>
            <td>
              <Button variant='outline-success' onClick={() => acceptRequest(req._id)}>Accept</Button>
              <span> </span>
              <Button variant='outline-danger' onClick={() => denyRequest(req._id)}>Deny</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  ) : (
    <h3>No remaining requests</h3>
  );

  // Only render historyModal is data is set
  let historyModal = historyData.memberName && (
    <Modal show={showHistoryModal} onHide={closeHistory}>
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: 18, fontWeight: 'lighter' }}>
          History of Approved Requests for {historyData.memberName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {historyData.history.length > 0 ? (
          <Table size='sm' hover bordered>
            <thead>
              <tr style={{ color: 'black' }}>
                <th>Submitted On</th>
                <th>Type</th>
                <th>Value</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {historyData.history.map(req => (
                <tr key={req._id} style={{ color: 'black' }}>
                  <td>{ req.submittedDate }</td>
                  <td>{ req.type }</td>
                  {req.type === 'Excused Absence' ? (
                    <td>
                      { req.value.toString().substring(4, 6) }/
                      { req.value.toString().substring(6, 8) }/
                      { req.value.toString().substring(0, 4) }
                    </td>
                  ) : (
                    <td>{ req.value }</td>
                  )}
                  <td>{ req.description }</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <h3>No history yet</h3>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant='outline-secondary' onClick={closeHistory}>Close</Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <div id='points-log' style={{ color: 'white' }}>
      <Layout>
        <div id='ktp-content'>
          <Container>
            <Col xs={12}>
              <Row>
                <div className='col-xs-20 text-center' style={{ margin: '0 auto' }}>
                  <Button
                    variant='info'
                    size='sm'
                    onClick={() => setShowExcusedModal(true)}
                  >
                    Submit Excused Absence
                  </Button>
                  <span> </span>
                  <Button
                    variant='info'
                    size='sm'
                    onClick={() => setShowHoursModal(true)}
                  >
                    Log Service Hours
                  </Button>
                  <span> </span>
                  <Button
                    variant='info'
                    size='sm'
                    onClick={() => setShowPointsModal(true)}
                  >
                    Log Brotherhood Points
                  </Button>
                  <span> </span>
                  {props.member && props.member.admin ? (
                    <>
                      <Button variant='primary' size='sm' onClick={() => setShowRequestsModal(true)}>
                        Review Requests
                      </Button>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </Row>
              <br />
              <Col xs={12}>
                <Row>
                  <Col xs={12} lg={5}>
                    <h2>Fall 2020 Members</h2>
                  </Col>
                  <Col xs={7} lg={{ span: 1, offset: 4 }}>
                    <h3>Filter: </h3>
                  </Col>
                  <Col xs={5} lg={2}>
                    <Form.Control
                      as='select'
                      defaultValue={roleFilter}
                      onChange={e => setRoleFilter(e.target.value)}
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                      <option>Alumni</option>
                    </Form.Control>
                  </Col>
                </Row>
              </Col>
              <Row style={{overflow: 'scroll' }}>
                <Table size='sm' style={{ color: 'white' }} bordered>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Brotherhood Points <br /> (10 Min / Semester)</th>
                      <th>Service Hours <br /> (5 Min / Semester)</th>
                      <th>Unexcused Absences <br />  (2 Max / Semester)</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.filter(member => handleFilter(member)).map(member => (
                      <tr key={member._id} onClick={() => showHistory(member.name)} style={{ cursor: 'pointer' }}>
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

          {/* Excused Absence Modal */}
          <Modal show={showExcusedModal} onHide={() => setShowExcusedModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Submit Excused Absences</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId='excuseDate'>
                  <Form.Label>Date you'll be missing</Form.Label>
                  <Form.Control
                    type='date'
                    defaultValue={excuseData.date}
                    onChange={e => setExcuseData({ ...excuseData, date: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group controlId='excuseDescription'>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Why cant you make this event?'
                    onChange={e => setExcuseData({ ...excuseData, description: e.target.value })}
                    required
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant='outline-secondary'
                style={{ marginRight: 8 }}
                onClick={() => setShowExcusedModal(false)}>
                  Close
                </Button>
                <Button type='submit' onClick={submitExcuse} disabled={!excuseData.description}>Submit</Button> 
            </Modal.Footer>
          </Modal>

          {/* Service Hours Modal */}
          <Modal show={showHoursModal} onHide={() => setShowHoursModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Log Service Hours</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId='hoursEarned'>
                  <Form.Label>Service Hours Earned</Form.Label>
                  <Form.Control
                    type='number'
                    defaultValue={hoursData.serviceHours}
                    min={1}
                    onChange={e => setHoursData({ ...hoursData, serviceHours: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group controlId='hoursDescription'>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='What did you do to earn these service hours?'
                    onChange={e => setHoursData({ ...hoursData, description: e.target.value })}
                    required
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='outline-secondary' style={{ marginRight: 8 }} onClick={() => setShowHoursModal(false)}>
                Close
              </Button>
              <Button type='submit' onClick={submitHours} disabled={!hoursData.serviceHours || !hoursData.description}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Brotherhood Points Modal */}
          <Modal show={showPointsModal} onHide={() => setShowPointsModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Log Brotherhood Points</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId='pointsEarned'>
                  <Form.Label>Points Earned</Form.Label>
                  <Form.Control
                    type='number'
                    defaultValue={pointsData.points}
                    min={1}
                    onChange={e => setPointsData({ ...pointsData, points: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group controlId='pointsDescription'>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='What did you do to earn these points?'
                    onChange={e => setPointsData({ ...pointsData, description: e.target.value })}
                    required
                  />
                </Form.Group>
              </Form>
              <br />
              <div>
                <label style={{ color: 'black' }}>What constitutes a brotherhood point?</label>
                <div>- Hanging out with other KTP members</div>
                <div>- Attending a service event</div>
                <div>- Attending a KTP event with a local company</div>
                <div>- Attending a hackathon</div>
                <div>- Going to a KTP social event</div>
                <div>- Wearing our letters</div>
                <div>- Contributing to the website</div>
                <div>- Attending a career fair</div>
                <div>- Recommend a friend to rush KTP</div>
                <div>- Anything that benefits and/or spreads the word about our frat</div>
                <br />
                <div>Questions about what counts for a brotherhood point? Contact anyone on eboard and submit a request anyways!</div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='outline-secondary' style={{ marginRight: 8 }} onClick={() => setShowPointsModal(false)}>
                Close
              </Button>
              <Button type='submit' onClick={submitPoints} disabled={!pointsData.description}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Review Requests Modal */}
          <Modal size='lg' show={showRequestsModal} onHide={() => setShowRequestsModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Review Requests</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {requestModalContent}
            </Modal.Body>
            <Modal.Footer>
              <Button variant='outline-secondary' onClick={() => setShowRequestsModal(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Request History Modal */}
          {historyModal}
        </div>
      </Layout>
    </div>
  );
}

// Maps Redux State to Component Props
const mapStateToProps = state => ({
  isLoading: state.auth.isLoading,
  member: state.auth.member,
});

// Maps Redux Action Creators to Component Prop Functions
const mapDispatchToProps = dispatch => ({
  loadMember: id => dispatch(actions.loadMember(id)),
  showToast: (type, msg) => dispatch(toastActions.show(type, msg)),
});

// Connects Redux and Redux Mappings to Component
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PointsLog));