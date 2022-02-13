import React from "react";
import { Row, Col, Card } from 'react-bootstrap'
import { Link } from "react-router-dom";

export default function Landing() {
  const cards = [
    {
      id: 1,
      front: "What is the capital of <u>Alaska</u>?",
      back: "Juneau",
      frontChild: <div>Hello there</div>,
      backChild: <p>This is a back child</p>
    },
    {
      id: 2,
      front: "What is the capital of California?",
      back: "Sacramento",
    },
    {
      id: 3,
      front: "What is the capital of New York?",
      back: "Albany",
    },
    {
      id: 4,
      front: "What is the capital of Florida?",
      back: "Tallahassee",
    },
    {
      id: 5,
      front: "What is the capital of Texas?",
      back: "Austin",
    },
    {
      id: 6,
      front: "What is the capital of New Mexico?",
      back: "Santa Fe",
    },
    {
      id: 7,
      front: "What is the capital of Arizona?",
      back: "Phoenix",
    },
  ];

  return (
    <div>

      <div style={{ margin: '5%' }}>
        <Row xs={1} md={4} className="g-4">
          {cards.map((data, idx) => (
            <Col>
              <Link style={{color: 'black', textDecoration: 'none'}} to={"/set/" + data.id}>
              <Card>
                <Card.Img variant="top" src="https://images.unsplash.com/photo-1643579471528-c4df37329804?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60" />
                <Card.Body>
                  <Card.Title>

                    {data.id}

                  </Card.Title>
                  <Card.Text>
                    This is a longer card with supporting text below as a natural
                    lead-in to additional content. This content is a little bit longer.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Link>
            </Col>
          ))}
      </Row>
    </div>
    </div >
  )
}