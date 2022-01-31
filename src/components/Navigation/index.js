import React from 'react'
import { Link } from "react-router-dom";
import { AuthUserContext } from '../Session';

import { Nav, NavDropdown, Navbar, Form, Button, FormControl } from 'react-bootstrap';
import { Input } from 'antd'

import SignOutButton from '../SignOut'
import * as ROUTES from "../../constants/routes";

const { Search } = Input;

export default function NavBar() {

  const onSearch = value => console.log(value);

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
        Navbar scroll
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
              test
            </Link>
          </Nav.Item>
          <Nav.Item bsPrefix='nav-link'><Link
            style={{ color: 'inherit', textDecoration: "none" }}
            to={ROUTES.TEST}
          >
            test1
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
          Navbar scroll
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
              test
            </Link>
          </Nav.Item>
          <Nav.Item bsPrefix='nav-link'>
            <Link
              style={{ color: 'inherit', textDecoration: "none" }}
              to={ROUTES.TEST}
            >
              test1
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