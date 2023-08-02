import React, { useState, useEffect, useRef } from 'react';
import { VStack, HStack, Button, ButtonGroup, Box, Text, Heading, Center, AbsoluteCenter, useBreakpoint } from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

// Mock data
const questions = [
    {
        question_id: 1,
        index: 1,
        question: 'How many years of work experience do you have in a sales or solutions engineering role?',
        answers: {
            1: `I don't have direct experience, but I have relevant experience in related fields`,
            2: 'Less than 1 year (Beginner)',
            3: '1 - 2 years (Junior)',
            4: '3 - 5 years (Intermediate)',
            5: '6 - 8 years (Senior)',
            6: '9 - 11 years (Expert)',
            7: '12 - 15 years (Master)',
            8: 'More than 15 years (Veteran)'
        },
        helperText: `Answer 20 questions to begin to see your matches`
    },
    {
        question_id: 221,
        index: 1,
        question: 'Which base salary range most closely alligns with your expectations for a future role?',
        answers: {
            1: `$80,000 to $90,000`,
            2: `$90,000 to $100,000`,
            3: `$100,000 to $110,000`,
            4: `$110,000 to $120,000`,
            5: `$120,000 to $130,000`,
            6: `$130,000 to $140,000`,
            7: `$140,000 to $150,000`,
            8: `$150,000+`,
        },
    },
    {
        question_id: 222,
        index: 1,
        question: 'Would you require a a company sponsored work visa to work in the United States?',
        answers: {
            1: `Yes`,
            2: `No`,
        },
    },
    {
        question_id: 223,
        index: 1,
        question: 'Which of the following metropolitan areas are you currently located in?',
        answers: {
            1: `San Francisco Bay Area, CA`,
            2: `Seattle, WA`,
            3: `Austin, TX`,
            4: `Boston, MA`,
            5: 'New York City, NY',
            6: 'Los Angeles, CA',
            7: 'San Diego, CA',
            8: `I'm located outside these metropolitan areas`,
        },
    },
    {
        question_id: 224,
        index: 1,
        question: 'How strongly do you prefer remote vs. in-office work?',
        answers: {
            1: `Strong preference for in-office work`,
            2: `Mild preference for in-office work`,
            3: `Mild preference for remote work`,
            4: `Strong preference for remote work`,
        },
    },
    {
        question_id: 225,
        index: 1,
        question: 'What is your comfort level with frequent travel for client meetings, events, etc.?',
        answers: {
            1: `I am not able or willing to travel for work`,
            2: `I prefer very minimal travel (less than 10% of the time)`,
            3: `I can handle some travel (10-25% of the time)`,
            4: `I am willing and able to travel a decent amount (25-50% of the time)`,
            5: 'I am comfortable with frequent travel (50-75% of the time)',
            6: 'I am comfortable with significant travel (more than 75% of the time)',
        },
    },
    {
        question_id: 226,
        index: 1,
        question: 'Would you prefer a role that focuses more on pre-sales (helping to secure the sale) or post-sales (onboarding and client consulting)?',
        answers: {
            1: `Pre-sales`,
            2: `Post-sales`,
            3: `I prefer a 50/50 mix`,
            4: `I don't have a specific preference`,
        },
    },
    {
        question_id: 227,
        index: 1,
        question: `What's your highest completed level of education?`,
        answers: {
            1: `High School Diploma`,
            2: `Associate Degree`,
            3: `Bachelor's Degree`,
            4: `Master's Degree`,
            5: 'Doctorate Degree',
            6: 'Professional Certification',
            7: `No Formal Education: I have not completed a formal education but have industry experience`,
            8: `Other: My educational background does not fit into the provided options, but i'm happy to discuss it in detail`,

        },
    },
    {
        question_id: 228,
        index: 1,
        question: `If you've pursued higher education, which of the following best describes your primary area of study?`,
        answers: {
            1: `Computer Science/Software Engineering`,
            2: `Electrical/Electronics Engineering`,
            3: `Mechanical/Civil Engineering`,
            4: `Business/Marketing`,
            5: `Mathematics/Statistics`,
            6: `Physics/Chemistry/Biology (Natural Sciences)`,
            7: `Humanities/Social Sciences`,
            8: `I did not pursue higher education`,
        },
    },
    {
        question_id: 184,
        index: 1,
        question: 'Which statement best describes your proficiency with AWS (Amazon Web Services)?',
        answers: {
            1: 'No experience',
            2: `Beginner: I have used AWS for simple tasks, such as launching an EC2 instance or setting up an S3 bucket.`,
            3: 'Intermediate: I regularly use a variety of AWS services for more complex tasks, such as setting up a VPC, using Lambda functions, or managing RDS databases.',
            4: 'Advanced: I can design, deploy, and manage complex infrastructures on AWS, including cost optimization and security management.',
        },
        helperText: `This is an example of a technical skills question. You can add all your technical skills by answering questions like this one later.`
    },
    {
        question_id: 229,
        index: 1,
        question: 'Over the last 2 years, what level of seniority have you most often engaged with in your role as a Sales Engineer?',
        answers: {
            1: `C-Level Executives`,
            2: `Senior Management (VP, Director)`,
            3: `Mid-level Management (Manager, Team Lead)`,
            4: `Individual Contributors`,
            5: 'Non-managerial staff',
            6: 'Consultants or external advisors',
            7: 'Technicians or end users',
            8: 'Other',
        },
    },
    {
        question_id: 230,
        index: 1,
        question: 'Over the last 2 years, what industry verticals or market segments do you have the most experience selling into as a Sales Engineer?',
        answers: {
            1: `Information Technology and Services`,
            2: `Manufacturing`,
            3: `Financial Services`,
            4: `Health Care`,
            5: `Retail`,
            6: `Government`,
            7: `Telecommunications`,
            8: `Education`,
        },
    },
    {
        question_id: 231,
        index: 1,
        question: `Over the last 2 years, have you primarily sold to SMBs, Mid-Market companies, or Enterprise-level companies as a Sales Engineer?`,
        answers: {
            1: `Primarily SMBs`,
            2: `Primarily Mid-Market companies`,
            3: `Primarily Enterprise-level companies`,
            4: `A mix, with a focus on SMBs`,
            5: `A mix, with a focus on Mid-Market companies`,
            6: `A mix, with a focus on Enterprise-level companies`,
        },
    },
    {
        question_id: 232,
        index: 1,
        question: `Over the last 2 years, what has been the average size of the customers (in terms of employee count) you have been dealing with in your Sales Engineer role?`,
        answers: {
            1: `Less than 50 employees`,
            2: `51 - 200 employees`,
            3: `201 - 500 employees`,
            4: `501 - 1,000 employees`,
            5: `1,001 - 5,000 employees`,
            6: `5,001 - 10,000 employees`,
            7: `10,001 - 50,000 employees`,
            8: `More than 50,000 employees`,
        },
    },
    {
        question_id: 233,
        index: 1,
        question: `What level of experience do you have in implementing APIs on behalf of prospective customers?`,
        answers: {
            1: `No experience`,
            2: `Beginner: Have participated in API implementation for customers with support from a team, but have not led the process`,
            3: `Intermediate: Have regularly led the process of implementing APIs for customers, with an understanding of the associated practices and protocols`,
            4: `Advanced: Have extensive experience in independently leading the process of API implementation for a variety of customers, with the ability to troubleshoot issues and optimize the process`,
        },
    },
    {
        question_id: 234,
        index: 1,
        question: `What would you say has been the average deal size you've worked on, in conjunction with AE's, over the last 2 years?`,
        answers: {
            1: `Less than $25,000`,
            2: `Between $25,000 and $50,000`,
            3: `Between $50,000 and $100,000`,
            4: `Between $100,000 and $200,000`,
            5: `Between $200,000 and $300,000`,
            6: `Between $300,000 and $500,000`,
            7: `Between $500,000 and $1M`,
            8: `More than $1M`,
        },
    },
    {
        question_id: 235,
        index: 1,
        question: `How would you rate your experience and understanding of REST and SOAP APIs?`,
        answers: {
            1: `No experience`,
            2: `Beginner: I understand the theoretical concepts of REST and SOAP, such as HTTP methods (GET, POST, PUT, DELETE) or XML messaging but have little to no practical experience`,
            3: `Intermediate: I have experience constructing API requests, working with endpoints, and understand the differences between stateless (REST) and stateful (SOAP) APIs from practical project work`,
            4: `Advanced: I have deep experience working with REST and SOAP APIs in a professional context. I've designed, developed, and maintained APIs and understand concepts like resources, collections, namespaces, error handling, and security concerns`,
        },
    },
    {
        question_id: 236,
        index: 1,
        question: `Which best describes your understanding of API Authentication Methods?`,
        answers: {
            1: `No experience`,
            2: `Beginner: I am familiar with the basics of API authentication methods like Basic Auth, API keys, OAuth but have limited practical application`,
            3: `Intermediate: I have implemented API authentication methods in my projects. I understand the differences between them and know when to use which`,
            4: `Advanced: I have extensive experience implementing various API authentication methods, including sophisticated ones like OAuth2.0 and JWT, in a professional context. I understand the security implications and best practices`,
        },
    },
    {
        question_id: 237,
        index: 1,
        question: `Do you hold any industry certifications? `,
        answers: {
            1: `Yes`,
            2: `No`,
        },
    },
    {
        question_id: 238,
        index: 1,
        question: `If you could choose, which of the following industries would you be most interested in representing as a Sales Engineer?`,
        answers: {
            1: `Business Intelligence (BI)`,
            2: `Cybersecurity`,
            3: `Data Analytics / Big Data`,
            4: `Customer Relationship Management (CRM)`,
            5: `Advertising Technology`,
            6: `DevOps and Cloud Infrastructure`,
            7: `Human Resource Management (HRM)`,
            8: `Other`,
        },

    },
    {
        question_id: 239,
        index: 1,
        question: `What type of company do you naturally gravitate towards? `,
        answers: {
            1: `Early Stage Startup: Less structure, high risk/high reward, wear multiple hats`,
            2: `Mid-Stage Startups: Enjoy a bit of structure, but still crave the dynamic environment of startups`,
            3: `Growth Stage Companies: Prefer a balance between structure and agility`,
            4: `Established Company: High structure, consistent reward, more rigid roles`,
        },
    },
    // Add more questions as needed...
];

questions.sort((a, b) => a.index - b.index);
console.log('sorted');

const OnboardingQuestions = ({ apiURL, selectedAnswers, setSelectedAnswers, hasLoaded, innerRef }) => {
    const { user, isAuthenticated } = useAuth0();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const timeoutId = useRef(null); // Keep reference to the timeout
    const [visibleIndexes, setVisibleIndexes] = useState([...Array(10).keys()]); // start with first 10 indexes
    const [showPrecedingEllipsis, setShowPrecedingEllipsis] = useState(false);
    const [showFollowingEllipsis, setShowFollowingEllipsis] = useState(true);

    const breakpoint = useBreakpoint({ ssr: false });
    console.log('current breakpoint:', breakpoint);


    const handleAnswerSelect = async (question_id, answer_id) => {
        setSelectedAnswers(prevState => ({
            ...prevState,
            [question_id]: answer_id,
        }));

        try {
            await axios.post(`${apiURL}/setUserAnswer`, {
                user_id: user.sub,
                question_id,
                answer_id
            });
        } catch (err) {
            console.error(err);
        }

        if (currentQuestionIndex < questions.length - 1) {
            // Clear the previous timeout if it exists
            if (timeoutId.current) {
                clearTimeout(timeoutId.current);
            }

            // Delay updating currentQuestionIndex by 500 milliseconds
            timeoutId.current = setTimeout(() => {
                // Add condition here
                if (currentQuestionIndex < questions.length - 1) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                }
            }, 500);
        }
    };

    useEffect(() => {
        // whenever currentQuestionIndex changes, recalculate visible indexes
        let newVisibleIndexes;
        let range = 10;
        if (breakpoint === 'sm') {
            range = 6;
        }
        else if (breakpoint === 'md') {
            range = 8;
        }
        console.log('range:', range);
        if (currentQuestionIndex < (range / 2)) {
            newVisibleIndexes = [...Array(range).keys()];
            setShowPrecedingEllipsis(false);
            setShowFollowingEllipsis(true);
        } else if (currentQuestionIndex >= questions.length - (range / 2)) {
            newVisibleIndexes = Array.from({ length: range }, (_, i) => questions.length - range + i);
            setShowPrecedingEllipsis(true);
            setShowFollowingEllipsis(false);
        } else {
            newVisibleIndexes = Array.from({ length: range }, (_, i) => currentQuestionIndex - (range / 2) + i);
            setShowPrecedingEllipsis(true);
            setShowFollowingEllipsis(true);
        }
        setVisibleIndexes(newVisibleIndexes);
    }, [currentQuestionIndex, breakpoint]); //depends on questions.length but that isn't a react state var. Can make one

    // When the component unmounts, clear the timeout
    useEffect(() => {
        return () => {
            if (timeoutId.current) {
                clearTimeout(timeoutId.current);
            }
        };
    }, []);

    // useEffect to set the currentQuestionIndex to the index of the first unanswered question when
    // hasLoaded is true, and make this effect dependent on hasLoaded
    useEffect(() => {
        if (hasLoaded) {
            const firstUnansweredQuestionIndex = questions.findIndex(question => !selectedAnswers.hasOwnProperty(question.question_id));
            setCurrentQuestionIndex(firstUnansweredQuestionIndex !== -1 ? firstUnansweredQuestionIndex : 0);
        }
        // Disable ESLint warning about exhaustive-deps because I don't want this to run every time selectedAnswers changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasLoaded]);

    return (
        <VStack spacing={0} w='100%' ref={innerRef}>
            <VStack w='80%' align='left'>
                <Box minHeight={16}>
                    {questions[currentQuestionIndex]?.helperText && (
                        <Text color="pink" my={4} alignSelf='flex-start' fontSize='lg'>
                            {questions[currentQuestionIndex].helperText}
                        </Text>
                    )}
                </Box>
                <Box borderRadius='md' color='white' borderColor='white' borderWidth={2} p={4}>
                    <Heading as='h2' size='18px' >
                        {questions[currentQuestionIndex] ? questions[currentQuestionIndex].question : null}
                    </Heading>
                </Box>
                <ButtonGroup variant='outline' isAttached w='100%' p='30px' pl={35} >
                    <VStack w='100%' spacing={4}>
                        {questions[currentQuestionIndex] && Object.entries(questions[currentQuestionIndex].answers).map(([answer_id, answer]) => (
                            <Button
                                key={answer_id}
                                onClick={() => handleAnswerSelect(questions[currentQuestionIndex].question_id, parseInt(answer_id))}
                                minWidth='100%'
                                textAlign='left'
                                justifyContent='flex-start'
                                p={4}
                                h='auto'
                                sx={{
                                    whiteSpace: 'normal',
                                    wordBreak: 'break-word',
                                }}
                                bg={selectedAnswers[questions[currentQuestionIndex].question_id] === parseInt(answer_id)
                                    ? '#6be99654'
                                    : 'rgba(255, 255, 255, 0.2)'}
                                borderRadius='md'
                                color='white'
                                borderWidth={selectedAnswers[questions[currentQuestionIndex].question_id] === parseInt(answer_id) ? 2 : 1}
                                borderColor={selectedAnswers[questions[currentQuestionIndex].question_id] === parseInt(answer_id) ? 'green.300' : 'white'}
                            >
                                <Text fontSize='14px'> {answer} </Text>
                            </Button>
                        ))}
                    </VStack>
                </ButtonGroup>
            </VStack>

            <HStack spacing={3} alignSelf='center' key={currentQuestionIndex}>
                {showPrecedingEllipsis && <Box>
                    <Heading as='h1' size='lg' alignSelf='baseline' pr={2} pb={4} >
                        ...
                    </Heading>
                </Box>}
                {visibleIndexes.map((index) => (
                    <Button
                        key={index}
                        onClick={() => setCurrentQuestionIndex(index)}
                        bg={
                            currentQuestionIndex === index
                                ? 'green.300'
                                : selectedAnswers.hasOwnProperty(questions[index]?.question_id)
                                    ? '#6be99654'
                                    : 'rgba(255, 255, 255, 0.2)'
                        }
                        _hover={{ bg: 'green.300' }}
                        borderRadius='full'
                        borderWidth={1}
                        borderColor='white'
                        size={['sm', 'md']}
                    >
                    </Button>
                ))}
                {showFollowingEllipsis &&
                    <Heading as='h1' size='lg' alignSelf='baseline' pr={2} pb={4} >
                        ...
                    </Heading>}
            </HStack>
        </VStack >
    );
};

export default OnboardingQuestions;
