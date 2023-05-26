import React, { useState, useEffect, useRef } from 'react';
import Collapsible from 'react-collapsible';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import goldfishLogo from './images/logo.png';
import profilePic from './images/profile.png';
import QuestionBank from './QuestionBank';
import { questionsData } from './QuestionsData';
import { useAuth0 } from '@auth0/auth0-react';
import { Spinner, Box, Text, SimpleGrid, Button, Input, HStack, VStack, Flex, Select, Collapse, useColorModeValue } from "@chakra-ui/react";
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

// TODO: make sure when a question is removed from the right side it is visdible again in the bank. 
function EmployerPage() {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { isAuthenticated, isLoading } = useAuth0();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [jobPosting, setJobPosting] = useState([]);
    const [selectedJobPostingQuestion, setSelectedJobPostingQuestion] = useState(null);
    const [questions, setQuestions] = useState(questionsData);


    const initialBorderColor = useColorModeValue("blue.500", "blue.200");
    const selectedBorderColor = useColorModeValue("blue.800", "blue.300");
    const initialColor = useColorModeValue("black", "white");
    const selectedColor = useColorModeValue("white", "black");
    const selectedBg = useColorModeValue("blue.200", "blue.700");
    const jobPostingInitialBorderColor = useColorModeValue("orange.500", "orange.200");
    const jobPostingSelectedBorderColor = useColorModeValue("orange.800", "orange.300");
    const jobPostingSelectedBackground = useColorModeValue("orange.100", "orange.760");

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

    // const addQuestionToJobPosting = () => {
    //     if (selectedQuestion && selectedAnswer) {
    //         setJobPosting(prev => [...prev, { question: selectedQuestion, selectedAnswer: selectedAnswer, importance: 'Required' }]);
    //         setQuestions(prev => prev.filter(question => question.questionID !== selectedQuestion.questionID));
    //         setSelectedQuestion(null);
    //         setSelectedAnswer(null);
    //     }
    // };

    // const addQuestionToJobPosting = (question, selectedAnswer) => {
    //     setJobPosting(prev => [...prev, { question: question.question, answers: question.answers, selectedAnswer: selectedAnswer, importance: 'Required' }]);
    // };

    const addQuestionToJobPosting = (question, selectedAnswer) => {
        console.log("Adding question: ", question); // Add this line
        const newQuestion = {
            question: question.question,
            answers: question.answers || [],
            selectedAnswer: selectedAnswer,
            importance: 'Required'
        };
        setJobPosting(prev => {
            const newJobPosting = [...prev, newQuestion];
            console.log("Job Posting after adding question: ", newJobPosting);
            console.log(questions);
            return newJobPosting;
        });
        setQuestions(prev => prev.filter(item => item.questionID !== question.questionID));
        console.log(questions);
    };

    const removeQuestionFromJobPosting = () => {
        if (selectedJobPostingQuestion && selectedJobPostingQuestion.question) {
            console.log(questions);
            setJobPosting(prev => prev.filter(item => item.question.questionID !== selectedJobPostingQuestion.questionID));
            setQuestions(prev => [...prev, selectedJobPostingQuestion]);
            setSelectedJobPostingQuestion(null);
        }
    };

    const handleJobPostingQuestionSelection = (question) => {
        console.log(questions);
        if (selectedJobPostingQuestion === question) {
            setSelectedJobPostingQuestion(null);
        } else {
            setSelectedJobPostingQuestion(question);
        }
    };

    const handleQuestionSelection = (question) => {
        if (selectedQuestion === question) {
            setSelectedQuestion(null);
        } else {
            setSelectedQuestion(question);
        }
    };

    const handleAnswerChange = (item, e) => {
        setJobPosting(prev => prev.map(question =>
            question.question.questionID === item.question.questionID
                ? { ...question, selectedAnswer: question.answers.find(answer => answer.answer === e.target.value) }
                : question
        ));
    };

    const handleImportanceChange = (item, e) => {
        setJobPosting(prev => prev.map(question =>
            question.question.questionID === item.question.questionID
                ? { ...question, importance: e.target.value }
                : question
        ));
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
            <VStack spacing='1vh'>
                <Box p='20px' w='100%' bg='#f5f5f5'>
                    <Text fontSize='20px' as='b'>Question Bank Filters</Text>
                    <Input
                        type='text'
                        placeholder='Search...'
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        bg='white'
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
                    <VStack spacing="5vh" alignItems='start' w="48%" ml='2vw'>
                        <HStack justifyContent='space-between' w='100%'>
                            <Text fontSize='2xl'>Question Bank</Text>
                            <Button isDisabled={selectedQuestion === null || selectedAnswer === null} onClick={() => addQuestionToJobPosting(selectedQuestion, selectedAnswer)}>Add</Button>
                        </HStack>
                        <QuestionBank
                            selectedCategory={selectedCategory}
                            searchTerm={searchTerm}
                            onQuestionSelect={setSelectedQuestion}
                            onAnswerSelect={setSelectedAnswer}
                            selectedQuestion={selectedQuestion || questions[0]}
                            selectedAnswer={selectedAnswer}
                            questions={questions}
                        />
                    </VStack>

                    <VStack spacing="5vh" alignItems='start' w="48%" ml='2vw'>
                        <HStack justifyContent='space-between' w='100%'>
                            <Text fontSize='2xl'>Job Posting Builder</Text>
                            <Button isDisabled={!selectedJobPostingQuestion} onClick={removeQuestionFromJobPosting}>Remove</Button>
                        </HStack>
                        <Box maxHeight='300px' overflowY='scroll' borderColor='gray.200' w='100%'>
                            {jobPosting.map((item, index) => (
                                <Box
                                    key={index}
                                    bg={selectedJobPostingQuestion === item ? jobPostingSelectedBackground : "white"}
                                    borderColor={selectedJobPostingQuestion === item ? jobPostingSelectedBorderColor : jobPostingInitialBorderColor}
                                    borderWidth={selectedJobPostingQuestion === item ? "5px" : "3px"}
                                    onClick={() => handleJobPostingQuestionSelection(item)}
                                    py={3}
                                    px={5}
                                    mb={3}
                                >
                                    <Text>{item.question}</Text>
                                    <HStack mt={2}>
                                        <Text>Answer:</Text>
                                        <Select value={item.selectedAnswer?.answer} onChange={(e) => handleAnswerChange(item, e)}>
                                            {item?.answers?.map((answer, index) => (
                                                <option key={index} value={answer.answer}>{answer.answer}</option>
                                            ))}
                                        </Select>
                                    </HStack>
                                    <HStack mt={2}>
                                        <Text>Importance:</Text>
                                        <Select value={item.importance} onChange={(e) => handleImportanceChange(item, e)}>
                                            <option value="Required">Required</option>
                                            <option value="Important">Important</option>
                                            <option value="Optional">Optional</option>
                                        </Select>
                                    </HStack>
                                </Box>
                            ))}
                        </Box>
                        {jobPosting.length > 0 && <Button colorScheme='blue'>Save</Button>}
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
