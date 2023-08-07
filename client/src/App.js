import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { switchAnatomy } from '@chakra-ui/anatomy';
// import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
// import { useNavigate } from 'react-router-dom';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import goldfishLogo from './images/logo.png';
import EmployerPage from './EmployerPage';
import Home from './Home';
import EmployerProfile from './EmployerProfile';
import CandidateLandingPage from './CandidateLandingPage';
import CandidatePage from './CandidatePage';
import './App.css';
// import { useAuth0 } from '@auth0/auth0-react';
// import { Spinner, Box, Text, SimpleGrid, Button, Input, HStack, VStack, Flex, Textarea, Avatar, Menu, MenuButton, MenuList, MenuItem, IconButton, useColorMode, useColorModeValue, Switch } from '@chakra-ui/react';
// import './App.css';

const deployURL = 'https://goldfishai.netlify.app';

function App() {
    const returnUrl = window.location.href.includes('localhost') ?
        (window.location.href.includes('3000') ? 'http://localhost:3000' : 'http://localhost:8080')
        : deployURL;


    // const boxy = definePartsStyle({
    //     track: {
    //         borderRadius: 'sm',
    //         p: 1,
    //     }
    // });

    // export const switchTheme = defineMultiStyleConfig({ variants: { boxy } });

    return (
        <div className='App' style={{ minHeight: '100%', left: '0px', width: '100%' }} >
            <Router>
                <Routes>
                    <Route path='/' element={<CandidateLandingPage returnURL={`${returnUrl}/`} />} />
                    <Route path='/employer' element={<EmployerPage returnURL={`${returnUrl}/employer`} />} />
                    <Route path='/employer/profile' element={<EmployerProfile returnURL={`${returnUrl}/employer`} />} />
                    <Route path='/employer/jobs' element={<EmployerProfile returnURL={`${returnUrl}/employer`} />} />
                    <Route path='/candidate' element={<CandidatePage returnURL={`${returnUrl}/candidate`} />} />
                    <Route path='/candidate/account' element={<CandidatePage returnURL={`${returnUrl}/candidate/account`} />} />
                    <Route path='/candidate/home' element={<CandidatePage returnURL={`${returnUrl}/candidate/home`} />} />
                    <Route path='/candidate/answers' element={<CandidatePage returnURL={`${returnUrl}/candidate/answers`} />} />
                    <Route path='/candidate/matches' element={<CandidatePage returnURL={`${returnUrl}/candidate/matches`} />} />
                    <Route path='/candidate/profile' element={<CandidatePage returnURL={`${returnUrl}/candidate/profile`} />} />
                    <Route path='/candidate/account' element={<CandidatePage returnURL={`${returnUrl}/candidate/account`} />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
