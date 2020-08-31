// Packages
import React from 'react';

// Bootstrap
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

function Description(props) {
  
  let content = props.desc ? (
    <>
      {props.desc.split('\n').map((line, index) => (
        <span key={index} style={{ paddingLeft: 15 }}>{ line }</span>
      ))}
    </>
  ) : (
    <span>
      This person doesn't have a bio, but it's safe to assume they love technology.
    </span>
  );

  return (
    <Row>
      <Col lg={{ span: 10, offset: 1 }}>
        { content }
      </Col>
    </Row>
  );
}

export default Description;