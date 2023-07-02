import React, { useState, useEffect, useRef, useCallback } from 'react';
// import Collapsible from 'react-collapsible';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { Link as ChakraLink } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
// import { useNavigate } from 'react-router-dom';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import goldfishLogo from './images/logo.png';
// import profilePic from './images/profile.png';
import QuestionBank from './QuestionBank';
import JobPostingBank from './JobPostingBank';
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
    // const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [selectedNonAnswers, setSelectedNonAnswers] = useState([]);
    const [selectedJobPostingQuestion, setSelectedJobPostingQuestion] = useState(null);
    const [jobPostingQuestions, setJobPostingQuestions] = useState([]);
    const [position, setPosition] = useState('');
    const [jobLocation, setJobLocation] = useState('');
    const [company, setCompany] = useState('myspace');
    const [canAddQuestion, setCanAddQuestion] = useState(false);
    const { colorMode, toggleColorMode } = useColorMode();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    const initialBorderColor = useColorModeValue('blue.500', 'blue.200');
    const selectedBorderColor = useColorModeValue('blue.800', 'blue.300');
    const initialColor = useColorModeValue('black', 'white');
    const selectedColor = useColorModeValue('white', 'black');
    const selectedBg = useColorModeValue('blue.200', 'blue.700');
    const jobPostingInitialBorderColor = useColorModeValue('orange.200', 'orange.200');
    const jobPostingSelectedBorderColor = useColorModeValue('orange.500', 'orange.300');
    const jobPostingSelectedBackground = useColorModeValue('orange.100', 'orange.760');

    const categories = ['Industry Certifications', 'Technical Knowledge', 'Tools & Platforms', 'Sales & Marketing Skills', 'Educational Background', 'Work & Industry Experience', 'HR / Work-Life Balance', 'Career Goals'];

    // const [message, setMessage] = useState(null);
    const [isPosting, setIsPosting] = useState(false);
    const [jobLoading, setJobLoading] = useState(false);
    // const isDev = process.env.NODE_ENV !== 'production';
    // const [url, setUrl] = useState((isDev) ? 'http://localhost:8080/api' : 'https://goldfishai-website.herokuapp.com/api');
    const [apiURL] = useState((window.location.href.includes('localhost')) ? 'http://localhost:8080/api' : 'https://goldfishai-website.herokuapp.com/api');
    const [jobPostingID, setJobPostingID] = useState(null);

    const postJob = useCallback(() => {
        console.log('tried to post', jobPostingQuestions);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userID: user.sub,
                company: company,
                location: jobLocation,
                jobName: position,
                jobPostingID: jobPostingID,
                jobData: JSON.stringify(jobPostingQuestions.reduce((acc, question) => {
                    acc[question.questionID] = [question.selectedAnswers, question.selectedNonAnswers, parseInt(question.importance)];
                    return acc;
                }, {}))
            })

        };
        console.log(requestOptions.body);
        fetch(`${apiURL}/postJob`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`status ${response.status}`);
                }
                return response.json();
            })
            .then(json => {
                setJobPostingID(json.jobPostingID);
                setIsPosting(false);
            }).catch(e => {
                console.error(e); // This will log any errors to the console.
                setIsPosting(false);
            });
    }, [user, jobPostingID, company, jobLocation, position, jobPostingQuestions, apiURL]);


    const handleFilterButtonClick = (category) => {
        setSelectedCategory(category === selectedCategory ? null : category);
        console.log(jobPostingQuestions);
    };

    // const loadJobPosting = (jobPostingID) => {

    // };

    const getAndLoadJobPosting = useCallback((jobPostingID) => {
        // console.log('getting job', jobPostingID);
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };
        if (!user) {
            console.log('no user');
            return;
        }
        fetch(`${apiURL}/getJob?userid=${user?.sub}&jobid=${jobPostingID}`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`status ${response.status}`);
                }
                return response.json();
            })
            .then(json => {
                loadJobPosting(json);
                setJobLoading(false);
            }).catch(e => {
                setJobLoading(false);
            });
    }, [user, apiURL]);

    // A method to set the jobPostingQuestions state based on the jobData field in the fetched data
    // TODO: Change jobData[questionID] to jobData[questionID][0] and jobData[questionID][1]
    const loadJobPostingQuestions = (jobData) => {
        // Assuming jobData is an object where the keys are questionIDs and the values are answerIDs
        // Convert it to an array of question objects

        // const newQuestion = { ...question, originalQuestion: question, importance: 'Required', selectedAnswer: answer };
        const loadedQuestions = Object.keys(jobData).map(questionID => {
            const matchingQuestion = questionBankQuestions.find(question => question.questionID === questionID);
            const jobMatchingAnswers = jobData[questionID][0];
            const jobMatchingNonAnswers = jobData[questionID][1];
            // const matchingAnswer = matchingQuestion.answers.find(answer => answer.answerID === jobData[questionID][0][0]); // Only handling one answer choice
            // const matchingNonAnswer = matchingQuestion.answers.find(answer => answer.answerID === jobData[questionID][1][0]); // Only handling one non-answer choice
            return { ...matchingQuestion, importance: (jobData[questionID][2] ? jobData[questionID][2] : 3), selectedAnswers: jobMatchingAnswers, selectedNonAnswers: jobMatchingNonAnswers };

        });

        setJobPostingQuestions(loadedQuestions);
    };

    // A method to filter out the loaded job posting questions from the question bank
    const filterQuestionBankOnLoad = (jobData) => {
        // Get the questionIDs of the loaded job posting questions
        const loadedQuestionIDs = Object.keys(jobData);

        // Filter out these questions from the question bank
        const filteredQuestionBank = questionBankQuestions.filter(question => {
            return !loadedQuestionIDs.includes(String(question.questionID));
        });

        setQuestionBankQuestions(filteredQuestionBank);
    };

    // Modify loadJobPosting to call these methods
    const loadJobPosting = (data) => {
        // console.log('data', data);
        setCompany(data.company);
        setJobLocation(data.location);
        setPosition(data.jobName);

        // Parse the jobData field into a JavaScript object
        const jobData = JSON.parse(data.jobData);

        loadJobPostingQuestions(jobData);
        filterQuestionBankOnLoad(jobData);
    };



    const sortQuestionBankQuestions = (bank) => {
        const sortedQuestions = bank.sort((a, b) => a.questionID - b.questionID);
        return sortedQuestions;
    };

    const addQuestionToJobPosting = (question) => {
        const newQuestion = {
            ...question,
            // originalQuestion: question,
            importance: 3,
            selectedAnswers: question.selectedAnswers,
            selectedNonAnswers: question.selectedNonAnswers,
        };
        console.log('adding question: ', newQuestion);

        setJobPostingQuestions(prev => [...prev, newQuestion]);
        setQuestionBankQuestions(prev => prev.filter(item => item.questionID !== question.questionID));
        setSelectedQuestion(null);
    };

    const removeQuestionFromJobPosting = (question) => {
        setQuestionBankQuestions(prev => {
            // const updatedList = [...prev, question.originalQuestion];
            const updatedList = [...prev, { answers: question.answers, category: question.category, question: question.question, questionID: question.questionID, tags: question.tags }]; //could make it copy back the selected answers, but probably feels weird
            // updatedList.sort((a, b) => a.questionID - b.questionID);
            return sortQuestionBankQuestions(updatedList);
        });
        // console.log('job posting questions: ', jobPostingQuestions);
        // console.log('question: ', question);
        setJobPostingQuestions(prev => prev.filter(item => item?.questionID !== question?.questionID));
        setSelectedJobPostingQuestion(null);
        setSelectedQuestion(null); // Add this line
    };

    // const getAnswerTextById = (question, answerId) => {
    //     const answerObject = question.answers.find(answer => answer.answerID === answerId);
    //     return answerObject ? answerObject.answer : '';
    // };

    const handleJobPostingQuestionSelection = (question) => {
        console.log('selectedJobPostingQuestion', selectedJobPostingQuestion, question);
        if (selectedJobPostingQuestion === question) {
            setSelectedJobPostingQuestion(null);
        } else {
            setSelectedJobPostingQuestion(question);
        }
    };

    const handleAnswerChange = (item, e) => {
        e.stopPropagation();
        const updatedQuestions = jobPostingQuestions.map((question) => {
            if (question.questionID === item.questionID) {
                const selectedAnswer = question.answers.find(
                    (answer) => answer.answer === e.target.value
                );
                return { ...question, selectedAnswers: [selectedAnswer.answerID] };
            }
            return question;
        });
        setJobPostingQuestions(updatedQuestions);
    };

    const handleNonAnswerChange = (item, e) => {
        e.stopPropagation();
        const updatedQuestions = jobPostingQuestions.map((question) => {
            if (question.questionID === item.questionID) {
                const selectedNonAnswer = question.answers.find(
                    (answer) => answer.answer === e.target.value
                );
                return { ...question, selectedNonAnswers: [selectedNonAnswer.answerID] };
            }
            return question;
        });
        setJobPostingQuestions(updatedQuestions);
    };

    const handleImportanceChange = (e, item) => {
        e.stopPropagation();
        setSelectedJobPostingQuestion(item);
        // console.log(item, e.target.selectedIndex, e.target.value);
        setJobPostingQuestions(prev => prev.map(question =>
            question.questionID === item.questionID
                ? { ...question, importance: e.target.value }
                : question
        ));
        // console.log(jobPostingQuestions);
    };

    const handleQuestionSelect = (question) => {
        setSelectedQuestion(question);
    };

    // const handleAnswerSelect = (answer, question) => {
    //     setSelectedAnswer(answer);
    //     setSelectedQuestion(question);
    // };

    const handleQuestionBankAnswerSelect = (answer, question, isSelected) => {
        // copy current state
        let updatedQuestionBankQuestions = [...questionBankQuestions];
        // find the right question
        let q = updatedQuestionBankQuestions.find(q => q.questionID === question.questionID);

        // initialize selectedAnswers and selectedNonAnswers arrays if they don't exist
        q.selectedAnswers = q.selectedAnswers || [];
        q.selectedNonAnswers = q.selectedNonAnswers || [];
        // console.log('handleAnswerSelect isSelected', isSelected);

        // if isSelected is true, remove the answer from the selectedAnswers list
        // otherwise, add the answer to the selectedAnswers list
        if (isSelected) {
            q.selectedAnswers = q.selectedAnswers.filter(a => a !== answer.answerID);
        } else {
            q.selectedAnswers.push(answer.answerID);
            // if this answer was a non-answer before, remove it from non-answers
            q.selectedNonAnswers = q.selectedNonAnswers.filter(a => a !== answer.answerID);
        }

        // setSelectedQuestion(q);
        setQuestionBankQuestions(updatedQuestionBankQuestions);
    };

    const handleQuestionBankNonAnswerSelect = (event, answer, question, isNonAnswer) => {
        // copy current state
        let updatedQuestionBankQuestions = [...questionBankQuestions];
        // find the right question
        let q = updatedQuestionBankQuestions.find(q => q.questionID === question.questionID);

        // initialize selectedAnswers and selectedNonAnswers arrays if they don't exist
        q.selectedAnswers = q.selectedAnswers || [];
        q.selectedNonAnswers = q.selectedNonAnswers || [];

        // if isNonAnswer is true, remove the answer from the selectedNonAnswers list
        // otherwise, add the answer to the selectedNonAnswers list
        if (isNonAnswer) {
            q.selectedNonAnswers = q.selectedNonAnswers.filter(a => a !== answer.answerID);
        } else {
            q.selectedNonAnswers.push(answer.answerID);
            // if this answer was a selected answer before, remove it from answers
            q.selectedAnswers = q.selectedAnswers.filter(a => a !== answer.answerID);
        }

        // setSelectedQuestion(q);
        setQuestionBankQuestions(updatedQuestionBankQuestions);
    };

    const handleJobPostingAnswerSelect = (answer, question, isSelected) => {
        let updatedJobPostingQuestions = [...jobPostingQuestions];
        // find the right question
        let q = updatedJobPostingQuestions.find(q => q.questionID === question.questionID);

        // initialize selectedAnswers and selectedNonAnswers arrays if they don't exist
        q.selectedAnswers = q.selectedAnswers || [];
        q.selectedNonAnswers = q.selectedNonAnswers || [];
        // console.log('handleAnswerSelect isSelected', isSelected);

        // if isSelected is true, remove the answer from the selectedAnswers list
        // otherwise, add the answer to the selectedAnswers list
        if (isSelected) {
            q.selectedAnswers = q.selectedAnswers.filter(a => a !== answer.answerID);
        } else {
            q.selectedAnswers.push(answer.answerID);
            // if this answer was a non-answer before, remove it from non-answers
            q.selectedNonAnswers = q.selectedNonAnswers.filter(a => a !== answer.answerID);
        }

        // setSelectedQuestion(q);
        setJobPostingQuestions(updatedJobPostingQuestions);
    };

    const handleJobPostingNonAnswerSelect = (event, answer, question, isNonAnswer) => {
        let updatedJobPostingQuestions = [...jobPostingQuestions];
        // find the right question
        let q = updatedJobPostingQuestions.find(q => q.questionID === question.questionID);

        // initialize selectedAnswers and selectedNonAnswers arrays if they don't exist
        q.selectedAnswers = q.selectedAnswers || [];
        q.selectedNonAnswers = q.selectedNonAnswers || [];

        // if isNonAnswer is true, remove the answer from the selectedNonAnswers list
        // otherwise, add the answer to the selectedNonAnswers list
        if (isNonAnswer) {
            q.selectedNonAnswers = q.selectedNonAnswers.filter(a => a !== answer.answerID);
        } else {
            q.selectedNonAnswers.push(answer.answerID);
            // if this answer was a selected answer before, remove it from answers
            q.selectedAnswers = q.selectedAnswers.filter(a => a !== answer.answerID);
        }
        setJobPostingQuestions(updatedJobPostingQuestions);
    };



    const handlePositionChange = (value) => {
        setPosition(value);
        // console.log(questionBankQuestions);
        console.log('jobpostingquestions:', jobPostingQuestions);
    };

    const handleLocationChange = (value) => {
        setJobLocation(value);
    };


    useEffect(() => {
        // const sortedQuestions = questionsData.sort((a, b) => a.questionID - b.questionID);
        setQuestionBankQuestions(sortQuestionBankQuestions(questionsData));
    }, []);

    useEffect(() => {
        if (location.pathname === "/employer") {
            // Reset state here
            setQuestionBankQuestions(sortQuestionBankQuestions(questionsData));
            setJobPostingQuestions([]);
            setJobLocation('');
            setPosition('');
            setCompany('myspace');
            setSelectedAnswers([]);
            setSelectedNonAnswers([]);
            setSelectedQuestion(null);
            setSelectedJobPostingQuestion(null);
            setSelectedCategory(null);
            setSearchTerm('');
            setJobPostingID(null);
        }
    }, [location]);

    // useEffect(() => {
    // }, [selectedAnswer, selectedQuestion]);

    useEffect(() => {
        // if jobPostingQuestions contains a question with questionID matching selectedQuestion.questionID and the question's selectedAnswers is not empty
        // then set a variable canAddQuestion to true
        // otherwise set it to false
        const canAddQuestion = questionBankQuestions.some(q => q.questionID === selectedQuestion?.questionID && q.selectedAnswers?.length > 0);
        setCanAddQuestion(canAddQuestion);
        // console.log('set canAddQuestion to', canAddQuestion);
        // console.log('selectedQuestion', selectedQuestion);
    }, [selectedQuestion, questionBankQuestions]);

    useEffect(() => {
        const jobIdFromUrl = searchParams.get('jobID') || searchParams.get('jobid'); // get jobID from the query string, either case
        if (jobIdFromUrl) { // if jobID exists in the URL
            console.log('loading job: ', jobIdFromUrl);
            setJobPostingID(jobIdFromUrl);
            getAndLoadJobPosting(jobIdFromUrl);
        }
    }, [user, jobPostingID]);


    return (
        <div className='Employer'>
            <Box bg='#1398ff' display='flex' justifyContent='space-between' alignItems='end' padding='1.5rem'>
                <Box display='flex' alignItems='baseline' p={0} onClick={() => navigate("/employer")}>
                    <ChakraLink as={RouterLink} to="/employer" style={{ textDecoration: 'none' }} display='inline-flex' alignItems='baseline'>
                        <Text fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }} fontWeight='700' fontFamily='Poppins' color='#FAD156'>Goldfish</Text>
                        <Text ml={3} fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }} fontWeight='700' fontFamily='Poppins' color='#FFFFFF'>ai</Text>
                    </ChakraLink>
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
                            <Button isDisabled={!canAddQuestion} width='auto' colorScheme={!canAddQuestion ? 'gray' : 'blue'} onClick={() => addQuestionToJobPosting(selectedQuestion, selectedAnswers, selectedNonAnswers)}>
                                <Text p={1}>Add</Text>
                            </Button>
                        </HStack>
                        <QuestionBank
                            selectedCategory={selectedCategory}
                            searchTerm={searchTerm}
                            onQuestionSelect={handleQuestionSelect}
                            onAnswerSelect={handleQuestionBankAnswerSelect}
                            onNonAnswerSelect={handleQuestionBankNonAnswerSelect}
                            questionBankQuestions={questionBankQuestions}
                        />
                    </VStack>

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
                                <Text p={12}>Remove</Text>
                            </Button>
                        </HStack>
                        <JobPostingBank
                            onQuestionSelect={handleJobPostingQuestionSelection}
                            onAnswerSelect={handleJobPostingAnswerSelect}
                            onNonAnswerSelect={handleJobPostingNonAnswerSelect}
                            onImportanceChange={handleImportanceChange}
                            jobPostingQuestions={jobPostingQuestions}
                        />
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
