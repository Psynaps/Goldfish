import React, { useState, useEffect, useRef, useCallback } from 'react';
// import Collapsible from 'react-collapsible';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import goldfishLogo from './images/logo.png';
// import profilePic from './images/profile.png';
import QuestionBank from './QuestionBank';
import { questionsData } from './QuestionsData';
import { useAuth0 } from '@auth0/auth0-react';
import { Spinner, Box, Text, SimpleGrid, Button, Input, HStack, VStack, Flex, Select, Textarea, Avatar, Menu, MenuButton, MenuList, MenuItem, IconButton, useColorMode, useColorModeValue, Switch } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import './App.css';

const deployURL = 'https://goldfishai.netlify.app';


// TODO: Make a saving and exporting of a job profile to JSON or CSV

// TODO: Bug in question bank/ larger section where it adjusts sizing when you select and unselect a category.

function LoginButton() {
    // const { colorMode } = useColorMode();
    const { loginWithRedirect } = useAuth0();

    // useEffect(() => {
    //     if (isAuthenticated) {
    //         navigate(location.pathname); // Redirect to the current page
    //     }
    // }, [isAuthenticated, navigate, location]);

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

function Home() {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const { isAuthenticated, isLoading, user } = useAuth0();

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
                                <Avatar src={user.picture} name={user.name} alt='Profile' borderRadius='full' boxSize='90%' />
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
    const [searchTerm, setSearchTerm] = useState('');
    const { isAuthenticated, isLoading, user, logout, loginWithRedirect } = useAuth0();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [questionBankQuestions, setQuestionBankQuestions] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(questionBankQuestions ? questionBankQuestions[0] : null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [selectedJobPostingQuestion, setSelectedJobPostingQuestion] = useState(null);
    const [jobPostingQuestions, setJobPostingQuestions] = useState([]);
    const [position, setPosition] = useState('');
    const [location, setLocation] = useState('');
    const { colorMode, toggleColorMode } = useColorMode();

    const initialBorderColor = useColorModeValue('blue.500', 'blue.200');
    const selectedBorderColor = useColorModeValue('blue.800', 'blue.300');
    const initialColor = useColorModeValue('black', 'white');
    const selectedColor = useColorModeValue('white', 'black');
    const selectedBg = useColorModeValue('blue.200', 'blue.700');
    const jobPostingInitialBorderColor = useColorModeValue('orange.200', 'orange.200');
    const jobPostingSelectedBorderColor = useColorModeValue('orange.500', 'orange.300');
    const jobPostingSelectedBackground = useColorModeValue('orange.100', 'orange.760');

    const categories = ['Industry Certifications', 'Technical Knowledge', 'Tools & Platforms', 'Sales & Marketing Skills', 'Educational Background', 'Work & Industry Experience', 'HR / Work-Life Balance', 'Career Goals'];


    const handleFilterButtonClick = (category) => {
        setSelectedCategory(category === selectedCategory ? null : category);
    };

    const addQuestionToJobPosting = (question, answer) => {
        const newQuestion = { ...question, originalQuestion: question, importance: 'Required', selectedAnswer: answer };
        setJobPostingQuestions(prev => [...prev, newQuestion]);
        setQuestionBankQuestions(prev => prev.filter(item => item.questionID !== question.questionID));
        setSelectedQuestion(null);
        setSelectedAnswer(null);
        console.log(user);
    };

    const removeQuestionFromJobPosting = (question) => {
        setQuestionBankQuestions(prev => {
            const updatedList = [...prev, question.originalQuestion];
            updatedList.sort((a, b) => a.questionID - b.questionID);
            return updatedList;
        });
        // console.log('job posting questions: ', jobPostingQuestions);
        // console.log('question: ', question);
        setJobPostingQuestions(prev => prev.filter(item => item?.originalQuestion?.questionID !== question?.originalQuestion?.questionID));
        setSelectedJobPostingQuestion(null);
        setSelectedQuestion(null); // Add this line
    };

    const handleJobPostingQuestionSelection = (question) => {
        if (selectedJobPostingQuestion === question) {
            setSelectedJobPostingQuestion(null);
        } else {
            setSelectedJobPostingQuestion(question);
        }
    };

    const handleAnswerChange = (item, e) => {
        e.stopPropagation();
        setSelectedJobPostingQuestion(item);
        setJobPostingQuestions(prev => prev.map(question =>
            question.question.questionID === item.question.questionID
                ? { ...question, selectedAnswer: question.answers.find(answer => answer.answer === e.target.value) }
                : question
        ));
    };

    const handleImportanceChange = (item, e) => {
        e.stopPropagation();
        setSelectedJobPostingQuestion(item);
        setJobPostingQuestions(prev => prev.map(question =>
            question.question.questionID === item.question.questionID
                ? { ...question, importance: e.target.value }
                : question
        ));
    };

    const handleQuestionSelect = (question) => {
        setSelectedQuestion(question);
    };

    const handleAnswerSelect = (answer, question) => {
        setSelectedAnswer(answer);
        setSelectedQuestion(question);
    };

    const handlePositionChange = (value) => {
        setPosition(value);
    };

    const handleLocationChange = (value) => {
        setLocation(value);
    };


    useEffect(() => {
        const sortedQuestions = questionsData.sort((a, b) => a.questionID - b.questionID);
        setQuestionBankQuestions(sortedQuestions);
    }, []);

    useEffect(() => {
    }, [selectedAnswer, selectedQuestion]);


    return (
        <div className='Employer'>
            <Box bg='#1398ff' display='flex' justifyContent='space-between' alignItems='end' padding='1.5rem'>
                <Box display='flex' alignItems='baseline' p={0}>
                    <Text fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }} fontWeight='700' fontFamily='Poppins' color='#FAD156'>Goldfish</Text>
                    <Text ml={3} fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }} fontWeight='700' fontFamily='Poppins' color='#FFFFFF'>ai</Text>
                </Box>
                <HStack spacing={5} alignItems='top'>
                    {isLoading ? <Spinner /> :
                        <>
                            {(isAuthenticated) ?
                                <VStack spacing={1} alignItems='center'>
                                    <Avatar src={user.picture} name={user.name} alt='Profile' borderRadius='full' boxSize={45} />
                                    <Box bg='#FAD156' borderRadius='full' px={2}>
                                        <Text fontSize={{ base: 'sm', md: 'md', lg: 'lg' }} color='black'>{user.name}</Text>
                                    </Box>
                                </VStack>
                                : <LoginButton />}
                            <Menu>
                                <MenuButton as={IconButton} aria-label='Options' icon={<ChevronDownIcon />} variant='outline' />
                                <MenuList>
                                    {(isAuthenticated) ? <MenuItem>Profile</MenuItem> : <></>}
                                    {(isAuthenticated) ? <MenuItem>Saved Jobs</MenuItem> : <></>}
                                    <MenuItem>Settings</MenuItem>
                                    <MenuItem>About Us</MenuItem>
                                    <MenuItem>
                                        <SimpleGrid columns={2} spacing={3}>
                                            <div>Dark Mode</div>
                                            <Switch colorScheme='blue' onChange={toggleColorMode} isChecked={colorMode === 'dark'} />
                                        </SimpleGrid>
                                    </MenuItem>
                                    <MenuItem onClick={() => logout({
                                        logoutParams: {
                                            returnTo: `${deployURL}/employer`,
                                        }
                                    })}>
                                        Log out
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        </>
                    }
                </HStack>
            </Box>
            <VStack spacing='1vh' align='stretch'>
                <Box p='20px' w='100%' bg='#f5f5f5'>
                    <Text fontSize='20px' as='b'>Question Bank Filters</Text>
                    <Input
                        type='text'
                        placeholder='Search...'
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        bg='white'
                    />
                    <SimpleGrid columns={4} spacing={2} my='15px'>
                        {categories.map(category => (
                            <Button
                                key={category}
                                onClick={() => handleFilterButtonClick(category)}
                                bg={selectedCategory === category ? selectedBg : 'white'}
                                color={selectedCategory === category ? selectedColor : initialColor}
                                borderColor={selectedCategory === category ? selectedBorderColor : initialBorderColor}
                                borderWidth={selectedCategory === category ? '5px' : '3px'}
                                // minW={'200px'} // Add this line
                                w={'auto'} // Add this line
                            >
                                <Text isTruncated>
                                    {category}
                                </Text>
                            </Button>
                        ))}
                    </SimpleGrid>
                </Box>

                <Flex direction={{ base: 'column', md: 'row' }} justify='space-between' w='100%'>
                    <VStack
                        spacing='5vh'
                        alignItems='start'
                        w={{ base: '100%', md: '48%' }}
                        mx='2vw'
                        mb='2vw'
                        border='1px'
                        borderColor='lightblue'
                        borderRadius='md'
                        p={5}
                    >
                        <HStack justifyContent='space-between' w='100%'>
                            <Text fontSize='2xl'>Question Bank</Text>
                            <Button isDisabled={selectedQuestion === null || selectedAnswer === null} width='auto' colorScheme={(selectedQuestion === null || selectedAnswer === null) ? 'gray' : 'blue'} onClick={() => addQuestionToJobPosting(selectedQuestion, selectedAnswer)}>
                                <Text p={1}>Add</Text>
                            </Button>
                        </HStack>
                        <QuestionBank
                            selectedCategory={selectedCategory}
                            searchTerm={searchTerm}
                            onQuestionSelect={handleQuestionSelect}
                            onAnswerSelect={handleAnswerSelect}
                            selectedQuestion={selectedQuestion || questionsData[0]}
                            selectedAnswer={selectedAnswer}
                            questions={questionsData}
                            questionBankQuestions={questionBankQuestions}
                            onAddQuestionToJobPosting={addQuestionToJobPosting}
                        />
                    </VStack>

                    <VStack
                        spacing='5vh'
                        alignItems='start'
                        w={{ base: '100%', md: '48%' }}
                        mx='2vw'
                        mb='2vw'
                        border={1}
                        borderColor='lightblue'
                        borderRadius='md'
                        p={5}
                    >
                        <HStack justifyContent='space-between' w='100%'>
                            {/* <Text fontSize='2xl'>Job Posting Builder</Text> */}
                            <Textarea
                                placeholder='Position'
                                onChange={e => handlePositionChange(e.target.value)}
                                minHeight='15%'
                            />
                            <Textarea
                                placeholder='Location'
                                onChange={e => handleLocationChange(e.target.value)}
                                minHeight='15%'
                            />
                            <Button isDisabled={!selectedJobPostingQuestion} colorScheme={(selectedJobPostingQuestion) ? 'blue' : 'gray'} width='auto' onClick={() => { removeQuestionFromJobPosting(selectedJobPostingQuestion); }}>
                                <Text p={4}>Remove</Text>
                            </Button>
                        </HStack>
                        <Box maxHeight='60vh' overflowY='auto' align='stretch' w='100%'>
                            {jobPostingQuestions.map((item, index) => (
                                <Box
                                    key={index}
                                    bg={selectedJobPostingQuestion?.questionID === item?.questionID ? jobPostingSelectedBackground : 'white'}
                                    borderColor={selectedJobPostingQuestion?.questionID === item?.questionID ? jobPostingSelectedBorderColor : jobPostingInitialBorderColor}
                                    borderWidth={selectedJobPostingQuestion?.questionID === item?.questionID ? '4px' : '3px'}
                                    onClick={() => handleJobPostingQuestionSelection(item)}
                                    py={3}
                                    px={5}
                                    mb={3}
                                    borderRadius="md"
                                >
                                    <Text>{item.originalQuestion.question}</Text>
                                    <HStack mt={2}>
                                        <Text>Answer:</Text>
                                        <Select
                                            value={item.selectedAnswer?.answer}
                                            onChange={(e) => handleAnswerChange(item, e)}
                                            onClick={e => e.stopPropagation()}
                                        >
                                            {item.originalQuestion?.answers?.map((answer, index) => (
                                                <option key={index} value={answer.answer}>{(answer.answer.indexOf(':') !== -1) ? answer.answer.substring(0, answer.answer.indexOf(':')) : answer.answer}</option>
                                            ))}
                                        </Select>
                                    </HStack>
                                    <HStack mt={2}>
                                        <Text>Importance:</Text>
                                        <Select
                                            defaultValue={item.importance}
                                            onChange={(e) => handleImportanceChange(item, e)}
                                            onClick={e => e.stopPropagation()}
                                        >
                                            <option value='Required'>Required</option>
                                            <option value='Important'>Important</option>
                                            <option value='Optional'>Optional</option>
                                        </Select>
                                    </HStack>
                                </Box>
                            ))}
                            {jobPostingQuestions.length > 0 && <Button colorScheme='blue'>Publish</Button>}
                        </Box>
                    </VStack>
                </Flex>
            </VStack >
        </div >
    );
}

// Create a profile state in the app



function App() {
    // const [page, setPage] = useState('home');
    // const [message, setMessage] = useState(null);
    // const [isFetching, setIsFetching] = useState(false);
    // const [url, setUrl] = useState('/api');

    // const fetchData = useCallback(() => {
    //     fetch(url)
    //         .then(response => {
    //             console.log('something1.1');
    //             if (!response.ok) {
    //                 throw new Error(`status ${response.status}`);
    //             }
    //             console.log('something1', response.json());
    //             return response.json();
    //         })
    //         .then(json => {
    //             console.log('something2', json.message);
    //             setMessage(json.message);
    //             setIsFetching(false);
    //         }).catch(e => {
    //             setMessage(`API call failed: ${e}`);
    //             setIsFetching(false);
    //         });
    // }, [url]);

    // useEffect(() => {
    //     setIsFetching(true);
    //     fetchData();
    // }, [fetchData]);

    return (
        <div className='App' >
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
