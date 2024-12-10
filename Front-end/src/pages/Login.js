import React, { useState, useContext } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useNavigate, Navigate } from 'react-router-dom';
import UserContext from "../UserContext";

function Login() {
    const { user, setUser } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    function loginUser(e) {
        e.preventDefault();

        fetch("http://localhost:4000/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(result => {
            if (!result.ok) {
                throw new Error('Network response was not ok');
            }
            return result.text(); // Read the response as text
        })
        .then(text => {
            console.log('Response text:', text);
            try {
                const result = JSON.parse(text); // Attempt to parse the text as JSON
                if (result.token) {
                    Swal.fire({
                        title: "LOGIN SUCCESS!",
                        text: "You can now use our enrollment system",
                        icon: "success"
                    });
                    if (typeof result.token !== "undefined") {
                        localStorage.setItem("token", result.token);
                        retrieveUserDetails(result.token);
                    }
                } else if (result.code === "USER-NOT-REGISTERED") {
                    Swal.fire({
                        title: "YOU ARE NOT REGISTERED",
                        text: "Please register to login",
                        icon: "warning"
                    });
                } else {
                    Swal.fire({
                        title: "INCORRECT PASSWORD!",
                        text: "Please try again",
                        icon: "error"
                    });
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
                Swal.fire({
                    title: "ERROR",
                    text: "An unexpected error occurred. Please try again later.",
                    icon: "error"
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                title: "ERROR",
                text: "An unexpected error occurred. Please try again later.",
                icon: "error"
            });
        });
    }

    const retrieveUserDetails = (token) => {
        fetch("http://localhost:4000/users/details", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(result => result.json())
        .then(data => {
            console.log(data);
            setUser({
                id: data.result._id,
                isAdmin: data.result.isAdmin
            });
            navigate('/profile-settings'); // Redirect to the profile page
        });
    }

    return (
        user.id !== null ?
        <Navigate to="/" />
        :
        <Container fluid className="vh-100">
            <Row>
                <Col className="vh-100 bg-warning col-6 d-flex flex-column align-items-center justify-content-center text-center">
                    <h1 className="display-5 fw-bold">CAN'T WAIT FOR YOU TO LOGIN!</h1>
                    <p className="display-6">Your Bright Future Begins Here!</p>
                </Col>

                <Col className="vh-100 col-6">
                    <Container fluid className="p-5 d-flex flex-column align-items-center justify-content-center vh-100">
                        <Form className="w-100 p-5 shadow rounded-3 border-bottom border-3 border-warning" onSubmit={e => loginUser(e)}>
                            <h1 className="display-5 fw-bold mb-5">LOGIN</h1>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Control type="email" placeholder="Enter your email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Control type="password" placeholder="Enter your password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Button variant="warning" className="w-100 rounded-pill" type="submit">Login</Button>
                            </Form.Group>
                        </Form>
                    </Container>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;