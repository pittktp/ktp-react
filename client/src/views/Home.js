// Packages
import React, { useEffect } from 'react';

// React Bootstap Components
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

// Custom
import Layout from './layouts/Layout';
import logo from '../img/KtpLetters.png';
import rush from '../img/FallRush2020.jpg';
import '../styles/Home.css';

const Home = () => {

  // Reset body colors to official KTP colors for this page
  useEffect(() => {
    let bodyElem = document.body;
    bodyElem.style.setProperty('--prof-color1', '#28B463');
    bodyElem.style.setProperty('--prof-color2', '#145BBD');
  });

  const rushItems = [
    {
      title: 'Grow Your Network',
      text: 'Network with potential future employers, alumni, and recruiters. Tour renown company sites in the Pittsburgh area like Google and Uber.'
    },
    {
      title: 'Expand Your Skillset',
      text: 'Take part in workshops and panels with professionals in the field to develop your technical skills and learn how to market them.'
    },
    {
      title: 'Give Back',
      text: 'Use your skillset to have a lasting impact on our community. Spread the love (of technology)!'
    },
    {
      title: 'Join Our Diverse Community',
      text: 'We are a group of multi-faceted individuals; Computer Scientists, Designers, Psychologists, Engineers, Businesspeople, Mathmaticians and many, many more.'
    }
  ];

  return (
    <div id='home'>
      <Layout>
        <header>
          <div id='ktp'>
            <img src={logo} alt=''></img>
            <br />
          </div>
          <br />
          <br />
          <div id='description' style={{ alignItems: 'center' }}>
            <h1>Professional Technology Fraternity at the University of Pittsburgh</h1>
            <br />
            <br />
            <a className='page-scroll' href='#rush'>
              <Button className='cta-btn' variant='outline-light'>
                <b>RUSH</b>
              </Button>
            </a>
          </div>
          <br />
          <br />
          <br />
        </header>
        <section id='rush' className='rush'>
          <Container>
            <Row>
              <Col md={4}>
                <div className='device-container'>
                  <div className='screen'>
                    <img className='img-responsive' src={rush} alt='' />
                  </div>
                </div>
              </Col>
              <Col md={8}>
                <Container fluid>
                  <Row>
                    {rushItems.slice(0, 2).map((item, id) => (
                      <Col key={id} md={6}>
                        <div className='rush-item'>
                          <h3>{item.title}</h3>
                          <p className='text-muted'>{item.text}</p>
                        </div>
                      </Col>
                    ))}
                  </Row>
                  <Row>
                    {rushItems.slice(2).map((item, id) => (
                      <Col key={id + 2} md={6}>
                        <div className='rush-item'>
                          <h3>{item.title}</h3>
                          <p className='text-muted'>{item.text}</p>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Container>
              </Col>
            </Row>
          </Container>
        </section>
        <section id='mission' className='cta'>
          <div className='cta-content'>
            <div className='container'>
              <h2>Our Mission</h2>
              <p>
                Kappa Theta Pi is the world's first co-educational professional technology fraternity.
                We work to build an active community of students with a shared interest in technology;
                sponsoring events aimed to provide intellectual, social, and professional resources to members.
                We seek to foster relationships within the local community, and with corporations;
                ultimately providing service and philanthropy to the local community.
                <br />
                <br />
                We hold events throughout the year, meeting with groups ranging from technology companies, to banks, to consulting firms.
                Pittsburgh is a burgeoning tech hub, and we are lucky to be here as the industry continues to explode.
                Cutting edge companies like Google and Uber are developing the newest innovations here in Pittsburgh,
                and have resources for us to be a part of it.
              </p>
            </div>
          </div>
          <div className='overlay'></div>
        </section>
        <section id='contact' className='contact bg-primary'>
          <Container>
            <h2>Hello, world.</h2>
            <ul className='list-inline list-social'>
              <li className='social-twitter'>
                <a href='https://twitter.com/pittktpbeta'><i className='fa fa-twitter' /></a>
              </li>
              <li className='social-facebook'>
                <a href='https://wwww.facebook.com/pittkappathetapi/?tsid=0.4662292894598893&source=typeahead'><i className='fa fa-facebook' /></a>
              </li>
              <li className='social-instagram'>
                <a href='https://www.instagram.com/pittkappathetapi/'><i className='fa fa-instagram' /></a>
              </li>
            </ul>
            <br />
            <p>Feel free to reach out to us with any questions!</p>
            <p>Contact: <a href='mailto:ewt6@pitt.edu'>EWT6@pitt.edu</a></p>
          </Container>
        </section>
      </Layout>
    </div>
  );
}

export default Home;