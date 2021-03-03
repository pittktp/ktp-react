// Packages
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Bootstrap
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';

// Custom
import Api from '../services/KTPApi';
import Layout from './layouts/Layout';
import '../styles/Members.css';

function Members(props) {
  // Component State
  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState('Active');

  useEffect(() => {
    // Only call API if members aren't already loaded
    if (members.length === 0) {
      // Only brings back email and picture if user is authenticated
      Api.getMembers()
        .then(data => setMembers(data.members));
    }
  });

  // Handles filtering members
  const filterMembers = member => {
    switch (filter) {
      case 'Inactive':
      case 'Alumni':
        return member.role === filter;
      default:
        return member.role !== 'Inactive' || member.role !== 'Alumni';
    }
  }

  // Handles navigating to a profile
  const viewProfile = email => {
    let id = email.split('@')[0];
    props.history.push(`/profile/${id}`);
  }

  return (
    <div id='members'>
      <Layout>
        <div id='ktp-content'>
          <div style={{ padding: '50px 20px', height: '100%' }}>
            <div style={{ width: '250px', margin: '0 auto' }}>
              <Form>
                <Form.Group controlId='memberType'>
                  <Form.Control
                    as='select'
                    defaultValue={filter}
                    onChange={e => setFilter(e.target.value)}
                    title='Click to filter members'
                  >
                    <option value='Active'>Active Members</option>
                    <option value='Inactive'>Inactive Members</option>
                    <option value='Alumni'>Alumni</option>
                  </Form.Control>
                </Form.Group>
              </Form>
            </div>
            <div className='grid'>
              <Row className='justify-content-center row-cols-1 row-cols-lg-4 rows-cols-md-3 rows-cols-sm-2 rows-cols-xs-1'>
                {members.filter(filterMembers).map((member, index) => (
                  <Col key={index} xs={8} sm={6} md={4} lg={3} className='mb-4'>
                    <Card className='members-card h-100'>
                      {props.isAuthenticated && member.picture ? (
                        <Image className='initials' src={member.picture} width='100px' roundedCircle />
                      ) : (
                        <div className='card-img-circle initials'>
                          {member.name.split(' ').map(part => part[0]).join('')}
                        </div>
                      )}
                      <Card.Body>
                        <Card.Title>{member.name}</Card.Title>
                        <Card.Subtitle>{member.major}</Card.Subtitle>
                        <div className='members-body'>
                          <Card.Text className='members-desc'>
                            {member.description}
                          </Card.Text>
                        </div>
                      </Card.Body>
                      {props.isAuthenticated && (
                        <Button className='members-link' variant='link' onClick={() => viewProfile(member.email)}>See More</Button>
                      )}
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}

// Maps Redux State to Component Props
const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

// Connects Redux to Component
export default connect(mapStateToProps)(withRouter(Members));
