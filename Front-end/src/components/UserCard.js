import { useContext, useState } from "react";
import { Card, Button, Modal, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import UserContext from "../UserContext";

export default function UserCard({ usersData}) {
  const { _id, firstName, middleName, lastName, email, contactNumber, isAdmin } = usersData;
  const fullName = `${firstName} ${middleName} ${lastName}`;

  const { user } = useContext(UserContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [updatedDetails, setUpdatedDetails] = useState({
    firstName,
    middleName,
    lastName,
    email,
    contactNumber,
    isAdmin,
  });

  const handleUpdate = () => {
    fetch("http://localhost:4000/users/update-user", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        id: _id, // Target user's ID
        updatedDetails, // Data to update
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.code === "UPDATE-SUCCESS") {
          Swal.fire({
            title: "Update Successful!",
            text: "User details have been updated.",
            icon: "success",
          });
          setShowEditModal(false);
          // Refresh user list after update
        } else {
          Swal.fire({
            title: "Update Failed",
            text: result.message,
            icon: "error",
          });
        }
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        Swal.fire({
          title: "Error",
          text: "An unexpected error occurred.",
          icon: "error",
        });
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    handleUpdate();
    setIsSubmitting(false);
  };

  return (
    <>
      <Card className="w-100 card-height mx-2 my-2 p-2 shadow">
        <Card.Body>
        <Card.Title>User ID</Card.Title>
        <Card.Text>{_id}</Card.Text>
          <Card.Title>Name</Card.Title>
          <Card.Text>{fullName}</Card.Text>
          <Card.Title>Email</Card.Title>
          <Card.Text>{email}</Card.Text>
          <Card.Title>Contact Number</Card.Title>
          <Card.Text>{contactNumber}</Card.Text>
          <Card.Title>Role</Card.Title>
          <Card.Text>{isAdmin ? "Admin" : "User"}</Card.Text>
          <Card.Footer>
            {user.isAdmin && (
              <>
                <Button
                  variant="primary"
                  className="w-100 rounded-pill"
                  onClick={() => setShowEditModal(true)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  className="w-100 rounded-pill mt-2"
                  onClick={() =>
                    Swal.fire({
                      title: "Delete User?",
                      text: "Are you sure you want to delete this user?",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonText: "Yes, delete it!",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        console.log("Delete user logic goes here");
                      }
                    })
                  }
                >
                  Delete
                </Button>
              </>
            )}
          </Card.Footer>
        </Card.Body>
      </Card>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={updatedDetails.firstName}
                onChange={(e) =>
                  setUpdatedDetails({ ...updatedDetails, firstName: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="middleName">
              <Form.Label>Middle Name</Form.Label>
              <Form.Control
                type="text"
                value={updatedDetails.middleName}
                onChange={(e) =>
                  setUpdatedDetails({ ...updatedDetails, middleName: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={updatedDetails.lastName}
                onChange={(e) =>
                  setUpdatedDetails({ ...updatedDetails, lastName: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={updatedDetails.email}
                onChange={(e) =>
                  setUpdatedDetails({ ...updatedDetails, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="contactNumber">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                type="text"
                value={updatedDetails.contactNumber}
                onChange={(e) =>
                  setUpdatedDetails({ ...updatedDetails, contactNumber: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="isAdmin">
              <Form.Check
                type="checkbox"
                label="Is Admin"
                checked={updatedDetails.isAdmin}
                onChange={(e) =>
                  setUpdatedDetails({ ...updatedDetails, isAdmin: e.target.checked })
                }
              />
            </Form.Group>
            <Button
              variant="warning"
              className="w-100 rounded-pill"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
