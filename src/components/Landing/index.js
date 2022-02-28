import React, { Component } from "react";
import { Row, Col, Card } from 'react-bootstrap'
import axios from 'axios'
import { Link, withRouter } from "react-router-dom";
import { compose } from 'recompose';
import { withFirebase } from '../Firebase/firebase';
import { withAuthorization } from '../Session';
import * as ROUTES from '../../constants/routes';

const RealLanding = () => (
  <div>
    <h1>SignIn</h1>
    <LandingPage />
  </div>
);

class Landing extends Component {
  constructor(props) {
    super(props);

    this.state = { sets: [] };
  }

  componentDidMount() {
    //console.log(this.props.firebase.auth.currentUser.uid)

    //if (this.state.sets.size == 0) {
    axios.get('http://localhost:4000/getSets', {
      crossdomain: true,
      //headers: { "Access-Control-Allow-Origin": "*" },
      params: {
        userUID: this.props.firebase.auth.currentUser.uid
      }
    })
      .then((response) => {
        console.log(response.data)
        this.setState({ sets: response.data })
      })
    //}


  }


  render() {
    console.log(this.state.sets)
    return (
      <div>

        <div style={{ margin: '5%' }}>
          <Row xs={1} md={4} className="g-4">
            {this.state.sets.map(data => {
              return (
                <Col>
                <Link style={{ color: 'black', textDecoration: 'none' }} to={"/set/" + data.id}>
                  <Card>
                    <Card.Img variant="top" src="https://images.unsplash.com/photo-1643579471528-c4df37329804?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60" />
                    <Card.Body>
                      <Card.Title>

                        {data.title}

                      </Card.Title>
                      <Card.Text>
                        {data.description}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>)
            })}
          </Row>
        </div>
        test

      </div >
    )
  }

}
/*
{cards.map((data, idx) => (
              <Col>
                <Link style={{ color: 'black', textDecoration: 'none' }} to={"/set/" + data.id}>
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
*/

const LandingPage = compose(withRouter, withFirebase)(Landing);

const condition = authUser => !!authUser;
export default withAuthorization(condition, ROUTES.LANDING)(RealLanding);


export { RealLanding };