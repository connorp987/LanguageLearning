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
    <LandingPage />
  </div>
);

class Landing extends Component {
  constructor(props) {
    super(props);

    this.state = { sets: [] };
  }

  componentDidMount() {
    axios.get('http://localhost:4000/getSets', {
      crossdomain: true,
      params: {
        userUID: this.props.firebase.auth.currentUser.uid
      }
    })
      .then((response) => {
        //console.log(response.data)
        this.setState({ sets: response.data })
      })
  }

  render() {
    return (
      <div>
        <div style={{ margin: '5%' }}>
          <Row xs={1} md={4} className="g-4">
            {this.state.sets.map(data => {
              return (
                <Col key={data.id}>
                  <Link style={{ color: 'black', textDecoration: 'none' }} to={`/set/${data.id}`}>
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
      </div >
    )
  }

}

const LandingPage = compose(withRouter, withFirebase)(Landing);

const condition = authUser => !!authUser;
export default withAuthorization(condition, ROUTES.LANDING)(RealLanding);

export { RealLanding };