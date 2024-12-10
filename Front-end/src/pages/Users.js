import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap"
import UserCard from "../components/UserCard";





export default function Users(){

    const [users, setUsers] = useState([]);

    const fetchUsers = () => {
        fetch("http://localhost:4000/users/all", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(result => result.json())
        .then(data => {
            console.log(data);
            if(data.code === "ALL-USERS-RESULT"){
                setUsers(data.result.map(data => {
                    return(
                        <Col lg={3} sm={12} className="d-flex flex-wrap">
                        <UserCard  key={data._id} usersData={data}/>
                        </Col>
                    )
                }));
            }else{
                setUsers([]); 
            }
        })
    }

    console.log(users)

    useEffect(() => {
        fetchUsers();
    }, [])

    return(
        <Container fluid className="p-5 d-flex flex-column justify-content-center align-items-center">
            <h1 className="mb-3 display-3 fw-bold">Welcome To The USERS Page</h1>
            <p className="mb-5"></p>

            <Container fluid className="bg-secondary p-3 ">
            <Row>
                {users}
              </Row>
              </Container>
        </Container>
    )
}