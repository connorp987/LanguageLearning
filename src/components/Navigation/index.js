import React from 'react'
import { Link } from "react-router-dom";
import { AuthUserContext } from '../Session';

import { Nav, NavDropdown, Navbar } from 'react-bootstrap';
import { Input } from 'antd'
import axios from 'axios'

import SignOutButton from '../SignOut'
import * as ROUTES from "../../constants/routes";

const { Search } = Input;

export default function NavBar() {

  const onSearch = value => {
    axios.get('http://api.genius.com/search?q=' + value, {
      headers: {
        'mode': 'no-cors',
        'Authorization': 'Bearer 1-LjtfA4MInZyXSKCt3CkScS8SPOXHZoINzcCHjI79a1-hOtPXAFpyIfPukKlod5'
      }
    })
      .then(function (response) {
        // handle success
        console.log(response);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
    console.log(value);
  }

  const Navigation = ({ authUser }) => (
    <div>
      <AuthUserContext.Consumer>
        {authUser =>
          authUser ? <NavigationAuth /> : <NavigationNonAuth />
        }
      </AuthUserContext.Consumer>
    </div>
  );

  const NavigationAuth = () => (
    <Navbar variant="dark" bg="dark" expand="lg">
      <Navbar.Brand><Link
        style={{ color: 'inherit', textDecoration: "none" }}
        to={ROUTES.LANDING}
      >
        LangMusik
      </Link></Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarScroll" />
      <Navbar.Collapse id="navbarScroll">
        <Nav
          className="me-auto"
          style={{ maxHeight: '100px' }}
          navbarScroll
        >
          <Nav.Item bsPrefix='nav-link'>
            <Link
              style={{ color: 'inherit', textDecoration: "none" }}
              to={ROUTES.LANDING}
            >
              Home
            </Link>
          </Nav.Item>
          <Nav.Item bsPrefix='nav-link'><Link
            style={{ color: 'inherit', textDecoration: "none" }}
            to={ROUTES.CREATE}
          >
            Create
          </Link></Nav.Item>
        </Nav>
        <Search placeholder="input search text" onSearch={onSearch} style={{ width: 200 }} />
        <Nav style={{ marginRight: '5%' }}>
          <NavDropdown title="Profile" id="navbarScrollingDropdown">
            <Nav.Item key="action:1"><Link style={{ color: 'inherit', textDecoration: "none" }} to={ROUTES.ADMIN}>Admin</Link></Nav.Item>
            <Nav.Item key="action:2"><Link style={{ color: 'inherit', textDecoration: "none" }} to={ROUTES.ACCOUNT}>Account</Link></Nav.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item key="action:3"><SignOutButton /></NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );

  const NavigationNonAuth = () => (
    <Navbar variant="dark" bg="dark" expand="lg">
      <Navbar.Brand>
        <Link
          style={{ color: 'inherit', textDecoration: "none" }}
          to={ROUTES.LANDING}
        >
          LangMusik
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarScroll" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav
          className="me-auto"
          style={{ maxHeight: '100px' }}
          navbarScroll
        >
          <Nav.Item bsPrefix='nav-link'>
            <Link
              style={{ color: 'inherit', textDecoration: "none" }}
              to={ROUTES.LANDING}
            >
              Home
            </Link>
          </Nav.Item>
          
        </Nav>
        <Search placeholder="input search text" onSearch={onSearch} style={{ width: 200 }} />
        <Nav style={{ marginRight: '5%' }}>
          <Nav.Item bsPrefix='nav-link'>
            <Link
              style={{ color: 'inherit', textDecoration: "none" }}
              to={ROUTES.SIGN_IN}
            >
              Sign In
            </Link>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );

  return (
    <Navigation />
  )
}