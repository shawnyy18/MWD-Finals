import { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Button, Form, Modal, Card } from "react-bootstrap";
import UserContext from "../UserContext";
import Swal from "sweetalert2";

export default function UserProfile() {
  const { user } = useContext(UserContext);

  const [showModal, setShowModal] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch user details
  const showUserDetails = () => {
    fetch("http://localhost:4000/users/details", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(result => {
      if (!result.ok) {
        throw new Error('Network response was not ok');
      }
      return result.json();
    })
    .then(data => {
      if (typeof data.result !== "undefined") {
        setFirstName(data.result.firstName);
        setMiddleName(data.result.middleName);
        setLastName(data.result.lastName);
        setEmail(data.result.email);
        setContactNumber(data.result.contactNumber);
        setIsAdmin(data.result.isAdmin);
      }
    })
    .catch(error => {
      console.error('Error fetching user details:', error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch user details. Please try again later.",
        icon: "error"
      });
    });
  };

  useEffect(() => {
    showUserDetails();
  }, []);

  const updateUserDetails = (e) => {
    e.preventDefault();

    fetch("http://localhost:4000/users/update-details", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        email: email,
        contactNumber: contactNumber,
        password: password,
        isAdmin: isAdmin
      })
    })
    .then(result => {
      if (!result.ok) {
        throw new Error('Network response was not ok');
      }
      return result.json();
    })
    .then(data => {
      if (data.msg === 'User updated successfully') {
        Swal.fire({
          title: "Success",
          text: data.msg,
          icon: "success"
        });
        setPassword(''); // Clear the password field
      } else {
        Swal.fire({
          title: "Error",
          text: data.msg,
          icon: "error"
        });
      }
    })
    .catch(error => {
      console.error('Error updating user details:', error);
      Swal.fire({
        title: "Error",
        text: "An unexpected error occurred. Please try again later.",
        icon: "error"
      });
    });
  };

  return (
    <Container>
      <h1>User Profile</h1>
      <Form onSubmit={updateUserDetails}>
        <Form.Group controlId="formFirstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formMiddleName">
          <Form.Label>Middle Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter middle name"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formLastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formContactNumber">
          <Form.Label>Contact Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter contact number"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password (Optional)</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formIsAdmin">
          <Form.Check
            type="checkbox"
            label="Is Admin"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Update Profile
        </Button>
      </Form>
    </Container>
  );
}
