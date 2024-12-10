import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import Swal from 'sweetalert2';

function ProfileSettings() {
    const [user, setUser] = useState({});
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    useEffect(() => {
        fetch("http://localhost:4000/users/details", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(result => result.json())
        .then(data => {
            if (typeof data.result !== "undefined") {
                setUser(data.result);
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
    }, []);

    const updatePassword = (e) => {
        e.preventDefault();

        fetch("http://localhost:4000/users/update-password", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                newPassword: newPassword,
                confirmNewPassword: confirmNewPassword
            })
        })
        .then(result => result.json())
        .then(data => {
            if (data.msg === 'Password updated successfully') {
                Swal.fire({
                    title: "Success",
                    text: data.msg,
                    icon: "success"
                });
                setNewPassword('');
                setConfirmNewPassword('');
            } else {
                Swal.fire({
                    title: "Error",
                    text: data.msg,
                    icon: "error"
                });
            }
        })
        .catch(error => {
            console.error('Error updating password:', error);
            Swal.fire({
                title: "Error",
                text: "An unexpected error occurred. Please try again later.",
                icon: "error"
            });
        });
    };

    return (
        <Container>
            <h1>Profile Settings</h1>
            <Form onSubmit={updatePassword}>
                <Form.Group controlId="formNewPassword">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formConfirmNewPassword">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Update Password
                </Button>
            </Form>
        </Container>
    );
}

export default ProfileSettings;