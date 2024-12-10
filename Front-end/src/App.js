import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import AppNavbar from './components/AppNavbar';
import Banner from './pages/Banner';
import CourseCard from './components/CourseCard';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './pages/Logout';
import ErrorPage from './pages/ErrorPage';
import { UserProvider } from './UserContext';
import Course from './pages/Course';
import AddCourse from './pages/AddCourse';
import UserProfile from './pages/UserProfile';
import Users from './pages/Users';
import ProfileSettings from './pages/ProfileSettings';


function App() {

  const [user, setUser] = useState({
    id: null,
    isAdmin: null
  })

  const unsetUser = () => {
    localStorage.clear();
  }

  useEffect(() => {
    fetch("http://localhost:4000/users/details", {
      method: "GET",
      headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
      }
  })
  .then(result => result.json())
  .then(data => {
      if(typeof data.result !== "undefined"){
        setUser({
          id: data.result._id,
          isAdmin: data.result.isAdmin
        })
      }
  })
  }, [])

  return (
    <>
    <UserProvider value={{user, setUser, unsetUser}}>
    <Router>
          <Container fluid>
            <AppNavbar user={user}/>
              <Routes>
                <Route path='/' element={<Banner/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/register' element={<Register/>}/>
                <Route path='/logout' element={<Logout setUser={setUser} unsetUser={unsetUser}/>}/>
                <Route path='/courses' element={<Course/>}/>
                <Route path='/add-course' element={<AddCourse/>}/>
                <Route path='/user-profile' element={<UserProfile/>}/>
                <Route path='/all-user' element={<Users/>}/>
                <Route path='/profile-settings' element={<ProfileSettings/>}/>
                <Route path='*' element={<ErrorPage/>}/>
              </Routes>
          </Container>
        </Router>
    </UserProvider>
        
    </>
  );
}

export default App;