import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { Link as ChakraLink } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import QuestionBank from './QuestionBank';
import JobPostingBank from './JobPostingBank';
import DropdownMenu from './DropdownMenu';
import { LoginButton } from './LoginButton';
import { questionsData } from './QuestionsData';
import { useAuth0 } from '@auth0/auth0-react';
import { Spinner, Box, Text, SimpleGrid, Button, Input, HStack, VStack, Flex, Textarea, Avatar, Spacer, useColorMode, useColorModeValue } from '@chakra-ui/react';
// import './App.css';

// const deployURL = 'https://goldfishai.netlify.app';


function EmployerPage(returnURL) {
    const [searchTerm, setSearchTerm] = useState('');
    const { isAuthenticated, isLoading, user } = useAuth0();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [questionBankQuestions, setQuestionBankQuestions] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(questionBankQuestions ? questionBankQuestions[0] : null);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [selectedNonAnswers, setSelectedNonAnswers] = useState([]);
    const [selectedJobPostingQuestion, setSelectedJobPostingQuestion] = useState(null);
    const [jobPostingQuestions, setJobPostingQuestions] = useState([]);
    const [job_title, setjob_title] = useState('Job Title');
    const [jobLocation, setJobLocation] = useState('');
    // const [company, setCompany] = useState('myspace');
    const [canAddQuestion, setCanAddQuestion] = useState(false);
    // const { colorMode, toggleColorMode } = useColorMode();
    const [searchParams] = useSearchParams();
    // const navigate = useNavigate();
    const location = useLocation();

    const initialBorderColor = useColorModeValue('blue.500', 'blue.200');
    const selectedBorderColor = useColorModeValue('blue.800', 'blue.300');
    const initialColor = useColorModeValue('black', 'white');
    const selectedColor = useColorModeValue('white', 'black');
    const selectedBg = useColorModeValue('blue.200', 'blue.700');
    // const jobPostingInitialBorderColor = useColorModeValue('orange.200', 'orange.200');
    // const jobPostingSelectedBorderColor = useColorModeValue('orange.500', 'orange.300');
    // const jobPostingSelectedBackground = useColorModeValue('orange.100', 'orange.760');

    const categories = ['Industry Certifications', 'Technical Knowledge', 'Deal Experience', 'Tools & Platforms', 'HR Preferences',
        'Job Specific HR',];

    // const [message, setMessage] = useState(null);
    const [isPosting, setIsPosting] = useState(false);
    const [jobLoading, setJobLoading] = useState(false);
    // const isDev = process.env.NODE_ENV !== 'production';
    // const [url, setUrl] = useState((isDev) ? 'http://localhost:8080/api' : 'https://goldfishai-website.herokuapp.com/api');
    const [apiURL] = useState((window.location.href.includes('localhost')) ? 'http://localhost:8080/api' : 'https://goldfishai-website.herokuapp.com/api');

    const [job_posting_id, setjob_posting_id] = useState(null);

    const postJob = useCallback(() => {
        setIsPosting(true);
        console.log('tried to post', jobPostingQuestions);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: user.sub,
                // company: company,
                home_office_address: jobLocation,
                job_title: job_title,
                job_posting_id: job_posting_id,
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
                setjob_posting_id(json.job_posting_id);
                setIsPosting(false);
            }).catch(e => {
                console.error(e); // This will log any errors to the console.
                setIsPosting(false);
            });
    }, [user, job_posting_id, jobLocation, job_title, jobPostingQuestions, apiURL]);


    const handleFilterButtonClick = (category) => {
        setSelectedCategory(category === selectedCategory ? null : category);
        console.log(jobPostingQuestions);
    };

    const getAndLoadJobPosting = useCallback((job_posting_id) => {
        // console.log('getting job', job_posting_id);
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };
        if (!user) {
            console.log('no user');
            return;
        }
        setJobLoading(true);
        console.log('getting job', job_posting_id);
        fetch(`${apiURL}/getJob?userid=${user?.sub}&jobid=${job_posting_id}`, requestOptions)
            .then(response => {
                console.log('response', response);
                if (!response.ok) {
                    throw new Error(`status ${response.status}`);
                }
                return response.json();
            })
            .then(json => {
                console.log('json', json);
                if (json.job_title) {
                    setjob_title(json.job_title);
                }
                if (json.home_office_address) {
                    setJobLocation(json.home_office_address);
                }
                if (json.jobData && json.jobData !== "{}") {
                    console.log('calling load job posting');
                    loadJobPosting(json);
                    setJobLoading(false);
                }
            }).catch(e => {
                setJobLoading(false);
            });
    }, [user, apiURL]);

    const loadJobPosting = (data) => {
        // setCompany(data.company);
        console.log('inside load job posting', data, data.job_title);
        let jobData;
        // Parse the jobData field into a JavaScript object
        try {
            jobData = JSON.parse(data["jobData"]);
            console.log('setting jobData', jobData);
        } catch (e) {
            console.log('error parsing jobData', e);
            return;
        }
        console.log('test2');
        console.log('jobData', jobData);

        loadJobPostingQuestions(jobData);
        filterQuestionBankOnLoad(jobData);
    };

    // A method to set the jobPostingQuestions state based on the jobData field in the fetched data
    const loadJobPostingQuestions = (jobData) => {

        // if jobData
        // const newQuestion = { ...question, originalQuestion: question, importance: 'Required', selectedAnswer: answer };
        const loadedQuestions = Object.keys(jobData).map(questionID => {
            const matchingQuestion = questionsData.find(question => question.questionID === questionID);
            const jobMatchingAnswers = jobData[questionID][0];
            const jobMatchingNonAnswers = jobData[questionID][1];
            // console.log('matchingQuestion', matchingQuestion);
            // console.log('jobMatchingAnswers', jobMatchingAnswers);
            // console.log('jobMatchingNonAnswers', jobMatchingNonAnswers);
            return { ...matchingQuestion, importance: (jobData[questionID][2] ? jobData[questionID][2] : 3), selectedAnswers: jobMatchingAnswers, selectedNonAnswers: jobMatchingNonAnswers };
        });
        // console.log('loadedQuestions', loadedQuestions);
        setJobPostingQuestions(loadedQuestions);
    };

    // A method to filter out the loaded job posting questions from the question bank
    const filterQuestionBankOnLoad = (jobData) => {
        // Get the questionIDs of the loaded job posting questions
        const loadedQuestionIDs = Object.keys(jobData);

        // Filter out these questions from the question bank
        // console.log('unfiltered questionBankQuestions', questionBankQuestions);
        const filteredQuestionBank = questionsData.filter(question => {
            return !loadedQuestionIDs.includes(String(question.questionID));
        });
        console.log('setting question bank questions to', filteredQuestionBank);
        setQuestionBankQuestions(filteredQuestionBank);
    };

    const sortQuestionBankQuestions = (bank) => {
        const sortedQuestions = bank.sort((a, b) => a.questionID - b.questionID);
        return sortedQuestions;
    };

    const addQuestionToJobPosting = (question) => {
        const newQuestion = {
            ...question,
            importance: 3,
            selectedAnswers: question.selectedAnswers,
            selectedNonAnswers: question.selectedNonAnswers,
        };
        console.log('adding question: ', newQuestion);

        console.log('prev jobPostingQuestions', jobPostingQuestions);
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
        setJobPostingQuestions(prev => prev.filter(item => item?.questionID !== question?.questionID));
        setSelectedJobPostingQuestion(null);
        setSelectedQuestion(null); // Add this line
    };

    const handleJobPostingQuestionSelection = (question) => {
        console.log('selectedJobPostingQuestion', selectedJobPostingQuestion, question);
        if (selectedJobPostingQuestion === question) {
            setSelectedJobPostingQuestion(null);
        } else {
            setSelectedJobPostingQuestion(question);
        }
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



    const handlejob_titleChange = (value) => {
        setjob_title(value);
        console.log('job_title', job_title, value);
        // console.log(questionBankQuestions);
        // console.log('jobpostingquestions:', jobPostingQuestions);
    };

    const handleLocationChange = (value) => {
        setJobLocation(value);
    };


    useEffect(() => {
        // const sortedQuestions = questionsData.sort((a, b) => a.questionID - b.questionID);
        console.log('initial set questionsData', questionsData);
        setQuestionBankQuestions(sortQuestionBankQuestions(questionsData));
    }, []);

    useEffect(() => {
        if (location.pathname === "/employer") {
            // Reset state here
            setQuestionBankQuestions(sortQuestionBankQuestions(questionsData));
            setJobPostingQuestions([]);
            setJobLocation('');
            setjob_title('');
            // setCompany('myspace');
            setSelectedAnswers([]);
            setSelectedNonAnswers([]);
            setSelectedQuestion(null);
            setSelectedJobPostingQuestion(null);
            setSelectedCategory(null);
            setSearchTerm('');
            setjob_posting_id(null);
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
            setjob_posting_id(jobIdFromUrl);
            getAndLoadJobPosting(jobIdFromUrl);
        }
    }, [user, getAndLoadJobPosting, searchParams]);


    return (
        <div className='Employer'>
            <Box bg='#1398ff' display='flex' justifyContent='space-between' alignItems='end' padding='1.5rem'>
                <Box display='flex' alignItems='baseline' p={0} >
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
                            <DropdownMenu returnURL={window.location.href} />
                        </>
                    }
                </HStack>
            </Box>
            <VStack spacing='1vh' align='stretch'>
                <Box p='20px' w='100%' bg='#f5f5f5' background='#1a202c' >
                    <Text fontSize='20px' as='b'>Question Bank Filters</Text>
                    <Input
                        type='text'
                        placeholder='Search...'
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        bg='white'
                        color='black'
                    />
                    <SimpleGrid columns={3} spacing={2} my='15px'>
                        {categories.map(category => (
                            <Button
                                key={category}
                                onClick={() => handleFilterButtonClick(category)}
                                bg={selectedCategory === category ? selectedBg : 'white'}
                                // color={selectedCategory === category ? selectedColor : initialColor}
                                color={selectedCategory === category ? 'white' : 'black'}
                                _hover={{
                                    color: 'white',
                                    bg: selectedCategory == category ? selectedBg : 'blue.600'
                                }}
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
                        // mb='2vw'
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
                        // mb='2vw'
                        border='1px'
                        borderColor='lightblue'
                        borderRadius='md'
                        p={5}
                    >
                        <Flex direction='row' justifyContent='flex-end' w='100%'>
                            {/* <Flex w='100%' direction='row' alignItems={'flex-end'}> */}
                            {/* <Text fontSize='2xl'>Job Posting Builder</Text> */}
                            <Textarea
                                // placeholder={job_title}
                                value={job_title}
                                onChange={e => handlejob_titleChange(e.target.value)}
                                minHeight='15%'
                            />
                            {/* <Textarea
                                placeholder='Location'
                                onChange={e => handleLocationChange(e.target.value)}
                                minHeight='15%'
                            /> */}
                            <Spacer p={2} />
                            <Button alignSelf='flex-end' isDisabled={!selectedJobPostingQuestion}
                                colorScheme={(selectedJobPostingQuestion) ? 'blue' : 'gray'}
                                w='125px'
                                p={2}
                                onClick={() => { removeQuestionFromJobPosting(selectedJobPostingQuestion); }}
                            >
                                <Text>Remove</Text>
                            </Button>
                            {/* </Flex> */}
                        </Flex>
                        <JobPostingBank
                            onQuestionSelect={handleJobPostingQuestionSelection}
                            onAnswerSelect={handleJobPostingAnswerSelect}
                            onNonAnswerSelect={handleJobPostingNonAnswerSelect}
                            onImportanceChange={handleImportanceChange}
                            jobPostingQuestions={jobPostingQuestions}
                        />
                        {(jobPostingQuestions.length > 0 && isAuthenticated && job_title === '') && <Button isDisabled colorScheme='blue' width='auto'>
                            <Text p={4}>Set job title to save</Text>
                        </Button>}
                        {(jobPostingQuestions.length > 0 && isAuthenticated && job_title !== '') && <Button colorScheme='blue' width='auto' onClick={() => postJob()}>
                            <Text p={4}>Save</Text>
                        </Button>}
                        {(jobPostingQuestions.length > 0 && !isAuthenticated) && <Button isDisabled colorScheme='blue' width='auto' >
                            <Text p={4}>Log in to Save</Text>
                        </Button>}
                    </VStack>
                </Flex>
            </VStack >
        </div >
    );
}

export default EmployerPage;