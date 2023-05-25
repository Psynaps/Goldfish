import React, { useState, useEffect, useRef } from 'react';
import Collapsible from 'react-collapsible';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import goldfishLogo from './images/logo.png';
import profilePic from './images/profile.png';
import QuestionBank from './QuestionBank';
import { useAuth0 } from '@auth0/auth0-react';
import { Spinner, Box, Text, SimpleGrid, Button, Input, HStack, VStack, Flex, useColorModeValue } from "@chakra-ui/react";
import './App.css';


// TODO: Make selected questions fill the job posting builder section and make it start initially empty
// TODO: Make a saving and exporting of a job profile to JSON or CSV

// TODO: Make sure add button correctly disables when no question or answer is selected. Also make sure the first question is initially selected if it is expanded.
//TODO: Implement way to clear category by resewlecting
function LoginButton() {
    const { loginWithRedirect } = useAuth0();

    // useEffect(() => {
    //     if (isAuthenticated) {
    //         navigate(location.pathname); // Redirect to the current page
    //     }
    // }, [isAuthenticated, navigate, location]);

    return (
        <button className='LoginButton' onClick={() => loginWithRedirect({ appState: { returnTo: window.location.href } })}>
            Log In
        </button>
    );
}

function LogoutButton() {
    const { logout } = useAuth0();

    return <button className='LogoutButton' onClick={() => logout({ returnTo: window.location.href })}>Log Out</button>;
}

// function profileDropdown() {

// }

function Home() {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const { isAuthenticated, isLoading } = useAuth0();

    const toggleDropdown = (event) => {
        setDropdownOpen(!isDropdownOpen);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        const handleWindowClick = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                handleClickOutside(event);
            }
        };

        window.addEventListener('mousedown', handleWindowClick);
        return () => {
            window.removeEventListener('mousedown', handleWindowClick);
        };
    }, []);

    return (
        <div className='Home'>
            <header className='Banner'>
                <div className='LogoContainer'>
                    <img src={goldfishLogo} alt='Logo' className='Logo' />
                    <div className='TitleLinkBox'>
                        <h1 className='Title'>Goldfish AI</h1>
                    </div>
                </div>
                {isLoading ? <Spinner /> :
                    ((isAuthenticated) ? <>
                        <div className='ProfileDropdown' ref={dropdownRef}>
                            <button className='ProfileButton' onClick={toggleDropdown}>
                                <img src={profilePic} alt='Profile' className='ProfileIcon' />
                            </button>
                            {isDropdownOpen && (
                                <div className='DropdownContent'>
                                    <SimpleGrid columns={1} spacing={3} >
                                        <button>Profile</button>
                                        <button>Settings</button>
                                        <LogoutButton />
                                    </SimpleGrid>
                                </div>
                            )}
                        </div>
                    </> : <LoginButton />)
                }
            </header>

            <div className='Body'>
                {/* <h2 className='BodyTitle'>Always swim in the job market.</h2> */}
                <Text fontSize='24px' color='white' mt='30px'>Always swim in the job market.</Text>
                <div className='QuestionContainer'>
                    <div className='QuestionBox'>
                        <p className='QuestionText'>How familiar are you with the job market?</p>
                    </div>
                    <div className='AnswerBox'>
                        <select className='Dropdown'>
                            <option value='very'>Very</option>
                            <option value='somewhat'>Somewhat</option>
                            <option value='not'>Not</option>
                        </select>
                    </div>
                </div>
                <div className='MatchesBox'>
                    <div className='BasedOnBox'>
                        <div className='BasedOnText'>Based on: 12 Q's</div>
                    </div>
                    <div className='Content'>
                        <p>Sample jobs matching your criteria:</p>
                        <div className='JobRow'>
                            <div className='MatchedJobIcon1'></div>
                            <p>Senior solutions architect, Midwest</p>
                        </div>
                        <div className='JobRow'>
                            <div className='MatchedJobIcon2'></div>
                            <p>Product manager, East Coast</p>
                        </div>
                        <div className='JobRow'>
                            <div className='MatchedJobIcon3'></div>
                            <p>Data scientist, West Coast</p>
                        </div>
                    </div>
                    <div className='GoButton'>Go!</div>

                </div>
            </div>
        </div>
    );
}

function EmployerPage() {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { isAuthenticated, isLoading } = useAuth0();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    const initialBorderColor = useColorModeValue("blue.500", "blue.200");
    const selectedBorderColor = useColorModeValue("blue.800", "blue.300");
    const initialColor = useColorModeValue("black", "white");
    const selectedColor = useColorModeValue("white", "black");
    const selectedBg = useColorModeValue("blue.200", "blue.700");

    const categories = ['Industry Certifications', 'Technical Knowledge', 'Tools & Platforms', 'Sales & Marketing Skills', 'Educational Background', 'Work & Industry Experience', 'HR / Work-Life Balance', 'Career Goals'];

    const toggleDropdown = (event) => {
        setDropdownOpen(!isDropdownOpen);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
    };

    const handleFilterButtonClick = (category) => {
        setSelectedCategory(category === selectedCategory ? null : category);
    };

    useEffect(() => {
        const handleWindowClick = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                handleClickOutside(event);
            }
        };

        window.addEventListener('mousedown', handleWindowClick);
        return () => {
            window.removeEventListener('mousedown', handleWindowClick);
        };
    }, []);

    return (
        <div className='Employer'>
            <header className='Banner'>
                <div className='LogoContainer'>
                    <img src={goldfishLogo} alt='Logo' className='Logo' />
                    <div className='TitleLinkBox'>
                        <h1 className='Title'>Goldfish AI</h1>
                    </div>
                </div>
                <div className='PortalText'>Employer Portal: Company X</div>

                {isLoading ? <Spinner /> :
                    ((isAuthenticated) ? <>
                        <div className='ProfileDropdown'>
                            <div className='ProfileAndSavedJobs'>
                                <button className='ProfileButton' onClick={toggleDropdown}>
                                    <img src={profilePic} alt='Profile' className='ProfileIcon' />
                                </button>
                                <button className='savedJobs'>Saved Jobs</button>
                            </div>
                            {isDropdownOpen && (
                                <div className='DropdownContent' ref={dropdownRef}>
                                    <SimpleGrid columns={1} spacing={3} >
                                        <button>Profile</button>
                                        <button>Settings</button>
                                        <LogoutButton />
                                    </SimpleGrid>
                                </div>
                            )}
                        </div>
                    </> : <LoginButton />)
                }
            </header>
            <VStack spacing={5}>
                <Box p='20px' w='100%' borderRadius='5px' bg='#f5f5f5'>
                    <Text fontSize='20px' as='b'>Question Bank Filters</Text>
                    <Input
                        type='text'
                        placeholder='Search...'
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <SimpleGrid columns={4} spacing={2} mt='15px' mb='15px'>
                        {categories.map(category => (
                            <Button
                                key={category}
                                onClick={() => handleFilterButtonClick(category)}
                                bg={selectedCategory === category ? selectedBg : "white"}
                                color={selectedCategory === category ? selectedColor : initialColor}
                                borderColor={selectedCategory === category ? selectedBorderColor : initialBorderColor}
                                borderWidth={selectedCategory === category ? "5px" : "3px"}
                            >
                                {category}
                            </Button>
                        ))}
                    </SimpleGrid>
                </Box>

                <Flex direction="row" justify="space-between" w="100%">
                    <VStack spacing={5} alignItems='start' w="48%" ml='20px'>
                        <HStack justifyContent='space-between' w='100%'>
                            <Text fontSize='2xl'>Question Bank</Text>
                            <Button isDisabled={selectedQuestion === null || selectedAnswer === null}>Add</Button>
                        </HStack>
                        <QuestionBank
                            selectedCategory={selectedCategory}
                            searchTerm={searchTerm}
                            onQuestionSelect={setSelectedQuestion}
                            onAnswerSelect={setSelectedAnswer}
                            selectedQuestion={selectedQuestion}
                        />
                    </VStack>

                    <VStack spacing={5} alignItems='start' w="48%">
                        <HStack justifyContent='space-between' width='100%'>
                            <Text fontSize='2xl'>Job Posting Builder</Text>
                            <Button>Remove</Button>
                        </HStack>
                        <Box maxHeight='300px' overflowY='scroll'>
                            <Collapsible trigger='Some Question for the Job'>
                                <div className='answerSection'>
                                    <hr />
                                    <div className='GridOfButtons'>
                                        <button>Choice 1</button>
                                        <button>Choice 2</button>
                                        <button>Choice 3</button>
                                        <button>Choice 4</button>
                                    </div>
                                </div>
                            </Collapsible>
                            <Collapsible trigger='Another Question for the Job'>
                                <div className='answerSection'>
                                    <hr />
                                    <div className='GridOfButtons'>
                                        <button>Choice 1</button>
                                        <button>Choice 2</button>
                                        <button>Choice 3</button>
                                        <button>Choice 4</button>
                                    </div>
                                </div>
                            </Collapsible>
                            <Collapsible trigger='Third Question for the Job'>
                                <div className='answerSection'>
                                    <hr />
                                    <div className='GridOfButtons'>
                                        <button>Choice 1</button>
                                        <button>Choice 2</button>
                                        <button>Choice 3</button>
                                        <button>Choice 4</button>
                                    </div>
                                </div>
                            </Collapsible>
                        </Box>
                        <Button colorScheme='blue'>Save</Button>
                    </VStack>
                </Flex>
            </VStack>
        </div>
    );
}




function App() {
    // const [page, setPage] = useState('home');

    return (
        <div className='App'>
            <Router>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/employer' element={<EmployerPage />} />
                    {/* <Route path='/callback' element={<Callback />} /> */}
                </Routes>
            </Router>
        </div>
    );
}

export default App;
