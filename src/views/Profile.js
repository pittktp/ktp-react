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
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

// Custom
import Academics from './components/Academics';
import Api from '../services/KTPApi';
import Description from './components/Description';
import Layout from './layouts/Layout';
import actions from '../redux/auth/actions';
import toastActions from '../redux/toast/actions';
import '../styles/Profile.css';

function Profile(props) {
  // Component State
  const [profile, setProfile] = useState(null);
  const [shouldUpdate, setShouldUpdate] = useState(true);
  const [initials, setInitials] = useState('');
  const [courseCats, setCourseCats] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [settingsData, setSettingsData] = useState({
    targetFile: null,
    description: '',
    color1: '',
    color2: '',
    major: '',
    gradSemester: '',
    rushClass: '',
    linkedIn: '',
    github: ''
  });

  useEffect(() => {
    // Redirect to homepage if not logged in
    if (!props.member && !props.isLoading) {
      props.history.push('/');
    }

    // Makes API call if Component should update it's state
    // `shouldUpdate` prunes out unnecessary excessive API calls
    if (shouldUpdate) {
      Api.getMember(props.match.params.id).then(data => {
        if (data.found) {
          const { member } = data;
          let bodyElem = document.body;
          // Set Profile
          setProfile(member);
          // Set Profile's initials
          setInitials(member.name.split(' ').map(part => part[0]).join(''));
          // Set Background Color CSS vars
          bodyElem.style.setProperty('--prof-color1', member.color[0]);
          bodyElem.style.setProperty('--prof-color2', member.color[1]);

          // Set Course Categories
          let cats = [];
          member.courses.forEach(course => {
            let cat = course.split(' ')[0];
            if (!cats.includes(cat)) {
              cats.push(cat);              
            }
          });

          setCourseCats(cats);

          // Set Settings Data Default Values
          setSettingsData({
            ...settingsData,
            description: member.description,
            color1: member.color[0],
            color2: member.color[1],
            major: member.major,
            gradSemester: member.gradSemester,
            rushClass: member.rushClass,
            linkedIn: member.linkedIn,
            github: member.github,
          });
        }
      });

      // Set `shouldUpdate` to false to prevent extra API calls
      setShouldUpdate(false);
    }
  }, [props, settingsData, shouldUpdate]);

  // Handles Form onChange events and updates Component State
  const handleChange = e => {
    setSettingsData({ ...settingsData, [e.target.name]: e.target.value });
  }

  // Gets file object from form input
  const handleFiles = () => {
    const uploader = document.querySelector('#customFile');
    const targetFile = uploader.files[0];
    setSettingsData({ ...settingsData, targetFile });
  }

  // Handles uploading a new profile picture
  const uploadPicture = () => {
    // Deconstruct file from settingsData
    const { targetFile } = settingsData;

    // Show error if file is null
    if (targetFile === null) {
      props.showToast('error', 'No Image Selected');
      return;
    }

    // Construct Form Data to be put in the API request body
    let extension = targetFile.name.split('.')[1];
    let fileName = props.match.params.id + "." + extension;

    var formData = new FormData();
    formData.append('newFileName', fileName);
    formData.append('shortName', props.match.params.id);
    formData.append('image', targetFile);

    // Call API to upload a picture for the current member
    Api.uploadPicture(props.member._id, formData).then(data => {
      if (data.success) {
        props.loadMember(props.member._id);
        props.showToast('success', 'Image Uploaded');
        setShouldUpdate(true);
      } else {
        props.showToast('error', data.error);
      }
    });
  }

  // Removes the current member's picture (returns to using initals)
  const resetPicture = () => {
    // Set file state to null
    setSettingsData({ ...settingsData, targetFile: null });

    // Call API to delete the picture
    Api.deletePicture(props.member._id).then(data => {
      if (data.success) {
        props.loadMember(props.member._id);
        props.showToast('success', 'Profile Picture Reset');
        setShouldUpdate(true);
      } else {
        props.showToast('error', data.error);
      }
    })
  }

  // Submits Change Description Form
  const changeDesc = () => {
    const { description } = settingsData;

    let payload = {
      updates: { description },
    };

    Api.updateMember(props.member._id, payload)
      .then(data => {
        if (data.success) {
          props.loadMember(props.member._id);
          props.showToast('success', 'Description Changed');
          setShouldUpdate(true);
        } else {
          props.showToast('error', data.error);
        }
      });
  }

  // Submits Change Colors Form
  const changeColors = () => {
    const { color1, color2 } = settingsData;

    let payload = { 
      updates: { color: [color1, color2] }
    };

    Api.updateMember(props.member._id, payload)
      .then(data => {
        if (data.success) {
          props.loadMember(props.member._id);
          props.showToast('success', 'Profile Colors Changed');
          setShouldUpdate(true);
        } else {
          props.showToast('error', data.error);
        }
      });
  }

  // Submits Change Major Form
  const changeMajor = () => {
    const { major } = settingsData;

    let payload = {
      updates: { major },
    };

    Api.updateMember(props.member._id, payload)
      .then(data => {
        if (data.success) {
          props.loadMember(props.member._id);
          props.showToast('success', 'Major Changed');
          setShouldUpdate(true);
        } else {
          props.showToast('error', data.error);
        }
      });
  }

  // Submits Change Graduation Semester Form
  const changeGradSem = () => {
    const { gradSemester } = settingsData;

    let payload = {
      updates: { gradSemester },
    };

    Api.updateMember(props.member._id, payload)
      .then(data => {
        if (data.success) {
          props.loadMember(props.member._id);
          props.showToast('success', 'Graduation Semester Changed');
          setShouldUpdate(true);
        } else {
          props.showToast('error', data.error);
        }
      });
  }

  // Submits Change Rush Class Form
  const changeRushClass = () => {
    const { rushClass } = settingsData;

    let payload = {
      updates: { rushClass },
    };

    Api.updateMember(props.member._id, payload)
      .then(data => {
        if (data.success) {
          props.loadMember(props.member._id);
          props.showToast('success', 'Rush Class Changed');
          setShouldUpdate(true);
        } else {
          props.showToast('error', data.error);
        }
      });
  }

  // Submits Change LinkedIn Link Form
  const changeLinkedIn = () => {
    const { linkedIn } = settingsData;

    let payload = {
      updates: { linkedIn },
    };

    Api.updateMember(props.member._id, payload)
      .then(data => {
        if (data.success) {
          props.loadMember(props.member._id);
          props.showToast('success', 'LinkedIn Link Changed');
          setShouldUpdate(true);
        } else {
          props.showToast('error', data.error);
        }
      });
  }

  // Submits Change GitHub Link Form
  const changeGithub = () => {
    const { github } = settingsData;

    let payload = {
      updates: { github },
    };

    Api.updateMember(props.member._id, payload)
      .then(data => {
        if (data.success) {
          props.loadMember(props.member._id);
          props.showToast('success', 'Github Link Changed');
          setShouldUpdate(true);
        } else {
          props.showToast('error', data.error);
        }
      });
  }

  // Conditional Rendering of Pofile Page to show settings button when
  // the current member is viewing their own profile
  let profilePage = profile && (
    <Container className='profile-container'>
      <Row>
        <Col lg={{ span: 8, offset: 2}}>
          <div className='profile-content'>
            <Row className='profile-header'>
              <Col md={2}>
                {profile && profile.picture ? (
                  <div className='profile-pic'>
                    <img src={profile.picture} alt={profile.name} title={profile.name} />
                  </div>
                ) : (
                  <div className='profile-no-pic'>
                    <span>{ initials }</span>
                  </div>
                )}
              </Col>
              <Col md={{ span: 5, offset: 1 }} className='profile-detail'>
                <Row style={{ textAlign: 'center', justifyContent: 'center' }}>
                  <h3 style={{ marginTop: 12 }}>{ profile.name }</h3>
                </Row>
                <Row className='profile-sub'>
                  <Col md={7}>
                    { profile.email }
                  </Col>
                  <Col md={5}>
                    { profile.rushClass } Class
                  </Col>
                </Row>
              </Col>
              <Col md={{ span: 2, offset: 1 }} className='profile-btns'>
                {props.member && profile && props.member._id === profile._id && (
                  <Button variant='primary' onClick={() => setShowModal(true)}>Settings</Button>
                )}
              </Col>
            </Row>
            <br />
            <Col lg={12} className='progress-bars'>
              <Row>
                <Col lg={{ span: 1, offset: 1 }}>Hours:</Col>
                <Col lg={{ span: 8, offset: 1 }}>
                  <ProgressBar id='service' now={profile.serviceHours * 20} max={100} />
                </Col>
                <Col lg={1}>
                  <span>{ profile.serviceHours }</span>
                </Col>
              </Row>
              <Row>
                <Col lg={{ span: 1, offset: 1 }}>Points:</Col>
                <Col lg={{ span: 8, offset: 1 }}>
                  <ProgressBar id='points' now={profile.points * 10} max={100} />
                </Col>
                <Col lg={1}>
                  <span>{ profile.points }</span>
                </Col>
              </Row>
            </Col>
            <br />
            <Col md={12}>
              <Row className='profile-info'>
                <Tabs defaultActiveKey='description'>
                  <Tab eventKey='description' title='Description'>
                    <Description desc={profile.description} />
                  </Tab>
                  <Tab eventKey='academics' title='Academics'>
                    <Academics
                      courses={profile.courses}
                      courseCats={courseCats}
                      gradSemester={profile.gradSemester}
                      major={profile.major}
                    />
                  </Tab>
                  <Tab eventKey='social' title='Contact'>
                    {profile && (
                      <Col lg={12} style={{ fontSize: 42 }}>
                        {profile.linkedIn && (
                          <a href={profile.linkedIn} style={{ marginRight: 10 }}>
                            <i className='fa fa-linkedin'></i>
                          </a>
                        )}
                        {profile.github && (
                          <a href={profile.github}>
                            <i className='fa fa-github'></i>
                          </a>
                        )}
                      </Col>
                    )}
                  </Tab>
                </Tabs>
              </Row>
            </Col>
          </div>
        </Col>
      </Row>
    </Container>
  );

  return (
    <div id='profile'>
      <Layout>
        <div id='ktp-container' style={{ paddingTop: 0 }}>
          {profilePage}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Settings</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form encType='multipart/form-data'>
                <div>
                  <input id='customFile' name='image' type='file' onChange={handleFiles} />
                </div>
                <br />
                <Row style={{ margin: '0 auto'}}>
                  <Button variant='outline-secondary' style={{ marginRight: 10 }} onClick={resetPicture}>
                    Default Picture
                  </Button>
                  <Button variant='outline-secondary' onClick={uploadPicture}>Update Picture</Button>
                </Row>
              </Form>
              <br />
              <br />
              <Form>
                <Form.Group controlId='profDesc'>
                  <Form.Label>Change Description</Form.Label>
                  <Form.Control
                    as='textarea'
                    name='description'
                    rows='3'
                    defaultValue={(profile && profile.description) || ''}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Button variant='outline-secondary' onClick={changeDesc}>Submit</Button>
              </Form>
              <br />
              <Form>
                <Form.Group controlId='profColor1'>
                  <Form.Label>Change Color 1 (use hex value):</Form.Label>
                  <Form.Control
                    name='color1'
                    type='text'
                    defaultValue={(profile && profile.color[0]) || '#28B463'}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId='profColor2'>
                  <Form.Label>Change Color 2 (use hex value):</Form.Label>
                  <Form.Control
                    name='color2'
                    type='text'
                    defaultValue={(profile && profile.color[1]) || '#145BBD'}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Button variant='outline-secondary' onClick={changeColors}>Change</Button>
              </Form>
              <br />
              <Form>
                <Form.Group controlId='pofMajor'>
                  <Form.Label>Change Major:</Form.Label>
                  <Form.Control
                    name='major'
                    type='text'
                    defaultValue={(profile && profile.major) || ''}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Button variant='outline-secondary' onClick={changeMajor}>Change</Button>
              </Form>
              <br />
              <Form>
                <Form.Group controlId='profGradSem'>
                  <Form.Label>Change Graduation Semester ("[Semester] [Year]"):</Form.Label>
                  <Form.Control
                    name='gradSemester'
                    type='text'
                    defaultValue={(profile && profile.gradSemester) || ''}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Button variant='outline-secondary' onClick={changeGradSem}>Update</Button>
              </Form>
              <br />
              <Form>
                <Form.Group controlId='profRush'>
                  <Form.Label>Change Rush Class:</Form.Label>
                  <Form.Control
                    name='rushClass'
                    type='text'
                    defaultValue={(profile && profile.rushClass) || ''}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Button variant='outline-secondary' onClick={changeRushClass}>Update</Button>
              </Form>
              <br />
              <Form>
                <Form.Group controlId='pofLinkedin'>
                  <Form.Label>Change LinkedIn Link:</Form.Label>
                  <Form.Control
                    name='linkedIn'
                    type='text'
                    defaultValue={(profile && profile.linkedIn) || ''}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Button variant='outline-secondary' onClick={changeLinkedIn}>Update</Button>
              </Form>
              <br />
              <Form>
                <Form.Group controlId='profGithub'>
                  <Form.Label>Change Github Link:</Form.Label>
                  <Form.Control
                    name='github'
                    type='text'
                    defaultValue={(profile && profile.github) || ''}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Button variant='outline-secondary' onClick={changeGithub}>Update</Button>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='outline-secondary' onClick={() => setShowModal(false)}>Close</Button>
            </Modal.Footer>
          </Modal>
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
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Profile));