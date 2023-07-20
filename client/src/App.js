import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import goldfishLogo from './images/logo.png';
import EmployerPage from './EmployerPage';
import Home from './Home';
import EmployerProfile from './EmployerProfile';
import CandidatePage from './CandidatePage';
// import { useAuth0 } from '@auth0/auth0-react';
// import { Spinner, Box, Text, SimpleGrid, Button, Input, HStack, VStack, Flex, Textarea, Avatar, Menu, MenuButton, MenuList, MenuItem, IconButton, useColorMode, useColorModeValue, Switch } from '@chakra-ui/react';
// import './App.css';

const deployURL = 'https://goldfishai.netlify.app';

function App() {
    const returnUrl = window.location.href.includes('localhost') ?
        (window.location.href.includes('3000') ? 'http://localhost:3000' : 'http://localhost:8080')
        : deployURL;
    return (
        <div className='App' >
            <Router>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/employer' element={<EmployerPage returnURL={`${returnUrl}/employer`} />} />
                    <Route path='/employer/profile' element={<EmployerProfile returnURL={`${returnUrl}/employer`} />} />
                    <Route path='/employer/jobs' element={<EmployerProfile returnURL={`${returnUrl}/employer`} />} />
                    <Route path='/candidate' element={<CandidatePage returnURL={`${returnUrl}/candidate`} />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
