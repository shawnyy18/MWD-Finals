import { useState, useContext } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import UserContext from "../UserContext";
import { Navigate } from "react-router-dom";

export default function Register() {
    const { user } = useContext(UserContext);

    let [firstName, setFirstName] = useState("");
    let [middleName, setMiddleName] = useState("");
    let [lastName, setLastName] = useState("");
    let [email, setEmail] = useState("");
    let [contactNumber, setContactNumber] = useState("");
    let [password, setPassword] = useState("");

    function register(e) {
        e.preventDefault();

        fetch("http://localhost:4000/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstName: firstName,
                middleName: middleName,
                lastName: lastName,
                email: email,
                contactNumber: contactNumber,
                password: password
            })
        })
        .then(result => {
            if (!result.ok) {
                throw new Error('Network response was not ok');
            }
            return result.json();
        })
        .then(result => {
            if (result.code === "REGISTRATION-SUCCESS") {
                Swal.fire({
                    title: "SUCCESS!",
                    text: result.message,
                    icon: "success"
                });
                setFirstName("");
                setMiddleName("");
                setLastName("");
                setEmail("");
                setContactNumber("");
                setPassword("");
            } else {
                Swal.fire({
                    title: "EMAIL IS ALREADY IN USE",
                    text: "Please try again with another email",
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

    return (
        user.id !== null ?
        <Navigate to="/" /> :
        <Container fluid className="vh-100">
            <Row>
                <Col className="vh-100 bg-warning col-6 d-flex flex-column align-items-center justify-content-center">
                    <h1 className="display-5 fw-bold">CAN'T WAIT FOR YOU TO LOGIN!</h1>
                    <p className="display-6">Your Bright Future Begins Here!</p>
                </Col>
                <Col className="vh-100 col-6">
                    <Container fluid className="p-5 d-flex flex-column align-items-center justify-content-center vh-100">
                        <Form className="w-100 p-5 shadow rounded-3 border-bottom border-3 border-warning" onSubmit={register}>
                            <h1 className="display-5 fw-bold mb-5">REGISTER</h1>
                            <Form.Group className="mb-3" controlId="formFirstName">
                                <Form.Control type="text" placeholder="Enter your first name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formMiddleName">
                                <Form.Control type="text" placeholder="Enter your middle name" required value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formLastName">
                                <Form.Control type="text" placeholder="Enter your last name" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formEmail">
                                <Form.Control type="email" placeholder="Enter your email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formContactNumber">
                                <Form.Control type="text" placeholder="Enter your contact number" required value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formPassword">
                                <Form.Control type="password" placeholder="Enter your password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Register
                            </Button>
                        </Form>
                    </Container>
                </Col>
            </Row>
        </Container>
    );
}