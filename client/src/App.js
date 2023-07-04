import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import goldfishLogo from './images/logo.png';
import EmployerPage from './EmployerPage';
import Home from './Home';
import { useAuth0 } from '@auth0/auth0-react';
import { Spinner, Box, Text, SimpleGrid, Button, Input, HStack, VStack, Flex, Textarea, Avatar, Menu, MenuButton, MenuList, MenuItem, IconButton, useColorMode, useColorModeValue, Switch } from '@chakra-ui/react';
import './App.css';

const deployURL = 'https://goldfishai.netlify.app';


// TODO: Make a saving and exporting of a job profile to JSON or CSV

// TODO: Bug in question bank/ larger section where it adjusts sizing when you select and unselect a category.

function LoginButton() {
    const { loginWithRedirect } = useAuth0();

    return (
        <Button onClick={() => loginWithRedirect({ returnTo: window.location.origin })} background='blue' borderRadius={15} color={useColorModeValue('white', 'white')}>
            Log In/Sign Up
        </Button>
    );
}

function LogoutButton() {
    const { logout } = useAuth0();

    return <button className='LogoutButton' onClick={() => logout({ returnTo: window.location.origin })}>Log Out</button>;
}



function App() {
    return (
        <div className='App' >
            <Router>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/employer' element={<EmployerPage />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
