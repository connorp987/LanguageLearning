import React, { useEffect, useState } from 'react';
import axios from 'axios'

import { withAuthorization } from '../Session';
import { Row, Col, Card } from 'react-bootstrap'

function HomePage() {
  const [song, setSong] = useState([])
  useEffect(() => {
    axios.get('http://localhost:4000')
      .then(function (response) {
        // handle success
        console.log(response.data);
        setSong(response.data[0])
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  }, [])
  return (
    <div>
      <h1>Home Page</h1>
      <div style={{whiteSpace: "pre-line"}}>{song}</div>
      <div style={{ margin: '5%' }}>
        <Row xs={1} md={4} className="g-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Col>
              <Card>
                <Card.Img variant="top" src="https://images.unsplash.com/photo-1643579471528-c4df37329804?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60" />
                <Card.Body>
                  <Card.Title>Card title</Card.Title>
                  <Card.Text>
                    This is a longer card with supporting text below as a natural
                    lead-in to additional content. This content is a little bit longer.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  )
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);