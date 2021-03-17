// Packages
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Bootstrap
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

// Custom
import Api from '../services/KTPApi';
import Layout from './layouts/Layout';
import defaultPic from '../img/default_pic.jpg';
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
        .then(data => setMembers(data.members.sort(sortMembers)));
    }
  });

  // Handles filtering members
  const filterMembers = member => {
    switch (filter) {
      case 'Inactive':
      case 'Alumni':
        return member.role === filter;
      case 'Active':
        return member.role !== 'Inactive' && member.role !== 'Alumni';
      default:
        return member.rushClass === filter;
    }
  }

  // Handles sorting members in alphabetical order
  const sortMembers = (memberA, memberB) => {
    if (memberA.name < memberB.name)
      return -1;
    else if (memberA.name > memberB.name)
      return 1;
    else
      return 0;
  }

  // Handles navigating to a profile
  const viewProfile = email => {
    let id = email.split('@')[0];
    props.history.push(`/profile/${id}`);
  }

  const getRushClassLetter = rushClass => {
    switch (rushClass.toUpperCase()) {
      case 'ALPHA':
        return 'Α';
      case 'BETA':
        return 'Β';
      case 'GAMMA':
        return 'Γ';
      case 'DELTA':
        return 'Δ';
      case 'EPSILON':
        return 'Ε';
      case 'ZETA':
        return 'Ζ';
      case 'ETA':
        return 'Η';
      case 'THETA':
        return 'Θ';
      case 'IOTA':
        return 'Ι';
      case 'KAPPA':
        return 'Κ';
      case 'LAMBDA':
        return 'Λ';
      case 'MU':
        return 'Μ';
      case 'NU':
        return 'Ν';
      case 'XI':
        return 'Ξ';
      case 'OMICRON':
        return 'Ο';
      case 'PI':
        return 'Π';
      case 'RHO':
        return 'Ρ';
      case 'SIGMA':
        return 'Σ';
      case 'TAU':
        return 'Τ';
      case 'UPSILON':
        return 'Υ';
      case 'PHI':
        return 'Φ';
      case 'CHI':
        return 'Χ';
      case 'PSI':
        return 'Ψ';
      case 'OMEGA':
        return 'Ω';
      default:
        return '';
    }
  }

  // Member Card
  const MemberCard = ({ member, index }) => (
    <Col className='mb-4' key={index} xs={8} sm={6} md={4} lg={3}>
      <div className='member-card'>
        <div className='member-img'>
          <img src={member.picture || defaultPic} />
        </div>
        <div className='member-hover' onClick={() => props.isAuthenticated && viewProfile(member.email)}>
          <span>
            { getRushClassLetter(member.rushClass) } | { member.gradSemester.split(' ')[1] }
            <br />
            { member.major || 'Undeclared' }
            <br />
            <a href={member.linkedIn}><i className='fa fa-linkedin' /></a>
          </span>
        </div>
      </div>
      <p className='member-name'>{ member.name }</p>
    </Col>
  );

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
                    <option>Alumni</option>
                    <option value='Alpha'>Alpha Class</option>
                    <option value='Beta'>Beta Class</option>
                    <option value='Gamma'>Gamma Class</option>
                    <option value='Delta'>Delta Class</option>
                    <option value='Epsilon'>Epsilon Class</option>
                    <option value='Zeta'>Zeta Class</option>
                    <option value='Eta'>Eta Class</option>
                    <option value='Theta'>Theta Class</option>
                    <option value='Iota'>Iota Class</option>
                    <option value='Kappa'>Kappa Class</option>
                  </Form.Control>
                </Form.Group>
              </Form>
            </div>
            <div className='grid' style={{ marginTop: '5vh', marginLeft: '8vw' }}>
              <Row className='justify-content-center row-cols-1 row-cols-lg-4 rows-cols-md-3 rows-cols-sm-2 rows-cols-xs-1'>
                {members.filter(filterMembers).map((member, index) => (
                  <MemberCard member={member} index={index} />
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
