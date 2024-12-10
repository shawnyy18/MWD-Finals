import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

function AppNavbar({ user }) {
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">MyApp</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {user.isAdmin === true ? (
                            <>
                                <Nav.Link as={Link} to="/add-course">Add Course</Nav.Link>
                                <Nav.Link as={Link} to="/user-profile">Profile</Nav.Link>
                                <Nav.Link as={Link} to="/all-user">Users</Nav.Link>
                                <Nav.Link as={Link} to="/logout">Logout</Nav.Link>
                            </>
                        ) : user.id !== null ? (
                            <>
                                <Nav.Link as={Link} to="/user-profile">Profile</Nav.Link>
                                <Nav.Link as={Link} to="/profile-settings">Profile Settings</Nav.Link>
                                <Nav.Link as={Link} to="/logout">Logout</Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AppNavbar;