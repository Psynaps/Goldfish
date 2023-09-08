import React, { useState, useEffect, useRef } from 'react';
import { VStack, HStack, Button, ButtonGroup, Box, Text, Heading, useBreakpoint } from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { ArrowRightIcon } from '@chakra-ui/icons';
// import { Link as ChakraLink } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { questionsData as questionsDataOriginal } from './QuestionsData';

const questions = questionsDataOriginal.filter(q => q.questionID <= 100);
//run through questions and convert answerID: number, answer: x to just answerID: answer
questions.forEach(q => {
    // map {answerID: 1, answer: 'x'} to just {1: 'x'}
    q.answers = Object.fromEntries(q.answers.map(a => [a.answerID, a.answer]));

});
console.log('questions:', questions);
// Mock data
/*
const questions2 = [
    {
        question_id: 1,
        index: 1,
        question: 'How many years of work experience do you have in a sales or solutions engineering role?',
        answers: {
            1: `I don't have direct experience, but I have relevant experience in related fields`,
            2: `1 - 2 years`,
            3: `3 - 4 years`,
            4: `5 - 6 years`,
            5: '7 - 10 years',
            6: '10+ years',
        },
        helperText: `Answer 20 questions to begin to see your matches`
    },
    {
        question_id: 2,
        index: 2,
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
        question_id: 3,
        index: 3,
        question: `What minimum annual OTE (on track earnings) would you require to consider a company?`,
        answers: {
            1: `Less than $25,000`,
            2: `$25,000 - $50,000`,
            3: `$50,000 - $75,000`,
            4: `$75,000 - $100,000`,
            5: `$100,000 - $125,000`,
            6: `$125,000 - $150,000`,
            7: `$150,000 - $200,000`,
            8: `$200,000+`,
        },
    },
    {
        question_id: 4,
        index: 4,
        question: 'Do you have any preferences on how OTE is measured? ',
        answers: {
            1: `Product specific, net-new revenue`,
            2: `Multi-product, net-new revenue`,
            3: `New logos / units sold`,
            4: `Upsell / x-sell revenue`,
            5: `Client renewals or retention`,
            6: `Customer satisfaction`,
            7: `Qualified leads / business development`,
            8: `No preference`,
        },
    },
    {
        question_id: 5,
        index: 5,
        question: 'Do you have a preference on the organizational unit at which OTE is evaluated? ',
        answers: {
            1: `Based on the performance of a single Account Executive`,
            2: `Based on the performance of a small group of Account Executives (manager level, <6)`,
            3: `Based on the performance of a larger group (director level, <30)`,
            4: `No preference`
        },
    },
    {
        question_id: 6,
        index: 6,
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
        question_id: 7,
        index: 7,
        question: 'What is your work from home preferences?',
        answers: {
            1: `Strong preference for remote work`,
            2: `Mostly prefer remote work, but open to occasional office visits`,
            3: `Balanced preference, equally comfortable with remote and in-office`,
            4: `Mostly prefer in-office work, but open to occasional remote work`,
            5: `Strong preference for in-office work`,
            6: `No strong preference, adaptable to both remote and in-office work`
        },
    },
    {
        question_id: 8,
        index: 8,
        question: 'Would you require a company sponsored work visa to work in the United States?',
        answers: {
            1: `Yes`,
            2: `No`
        },
    },
    {
        question_id: 9,
        index: 11,
        question: 'Would you prefer a role that focuses more on pre-sales (helping to secure the sale) or post-sales (onboarding and client consulting)?',
        answers: {
            1: `Pre-sales`,
            2: `Post-sales`,
            3: `I prefer a 50/50 mix`,
            4: `I don't have a specific preference`,
        },
    },
    {
        question_id: 10,
        index: 12,
        question: 'Which of the following types of B2B products would you most like to sell?',
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
        question_id: 11,
        index: 13,
        question: `What type of company do you naturally gravitate towards? `,
        answers: {
            1: `Early Stage Startup: Less structure, high risk/high reward, wear multiple hats`,
            2: `Mid-Stage Startups: Enjoy a bit of structure, but still crave the dynamic environment of startups`,
            3: `Growth Stage Companies: Prefer a balance between structure and agility`,
            4: `Established Company: High structure, consistent reward, more rigid roles`,
        },
    },
    {
        question_id: 12,
        index: 14,
        question: 'Do you have an industry that your work experience is primarily associatied with? ',
        answers: {
            1: `Software (SaaS/PaaS)`,
            2: `Manufacturing and Industrial`,
            3: `Telecom`,
            4: `Security`,
            5: `Healthcare & Pharmaceuticals `,
            6: `FinTech`,
            7: `Energy & Utilities `,
            8: `Other`,
        },
    },

    {
        question_id: 13,
        index: 15,
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
        question_id: 14,
        index: 16,
        question: 'How many years of sales engineering experience do you have in your industry area of specialization?',
        answers: {
            1: `Not applicable`,
            2: `1 - 2 years`,
            3: `3 - 4 years`,
            4: `5 - 6 years`,
            5: '7 - 10 years',
            6: '10+ years',
        },
    },
    {
        question_id: 15,
        index: 17,
        question: `What would you say has been the average deal size you've worked on, in conjunction with AE's, over the last 3 years?`,
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
        question_id: 16,
        index: 9,
        question: `What's your highest completed level of education?`,
        answers: {
            1: `No Formal Education`,
            2: `High School Diploma`,
            3: `Associate Degree`,
            4: `Bachelor's Degree`,
            5: `Master's Degree`,
            6: 'Doctorate Degree',
        },
    },
    {
        question_id: 17,
        index: 10,
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
        question_id: 18,
        index: 18,
        question: `Do you hold any industry certifications? `,
        answers: {
            1: `Yes`,
            2: `No`,
        },
    },
    {
        question_id: 19,
        index: 18,
        question: `What is the typical size of the companies (based on number of employees) that you have the most experience supporting on deals?`,
        answers: {
            1: `Under 100 employees (Small Businesses)`,
            2: `100-500 employees (Small to Medium-sized Businesses)`,
            3: `500-1,000 employees (Medium-sized Businesses)`,
            4: `1,000-5,000 employees (Large Businesses)`,
            5: `5,000-10,000 employees (Large to Enterprise Businesses)`,
            6: `10,000-50,000 employees (Enterprise Businesses)`,
            7: `50,000-100,000 employees (Large Enterprise Businesses)`,
            8: `100,000+ employees (Very Large Enterprise Businesses)`,
        },
    },
    {
        question_id: 20,
        index: 19,
        question: `How often have you been involved in running proof of concept (POC) or trial processes with prospects in the last 3 years?`,
        answers: {
            1: `Never: Not involved in running proof of concepts or trials in the last 2 years`,
            2: `Rarely: Involved a few times over the past 2 years`,
            3: `Occasionally: Involved several times a year`,
            4: `Frequently: Regular involvement on a monthly or more frequent basis`
        },
    },
    {
        question_id: 21,
        index: 20,
        question: `What is the minimum percentage of health insurance premium coverage provided by a company that would still make a job offer appealing to you?`,
        answers: {
            1: `I have other means of health coverage and do not require it from a job`,
            2: `Less than 25%`,
            3: `Between 25% and 50%`,
            4: `Between 50% and 75%`,
            5: `More than 75% but less than 100%`,
            6: `100%`
        },
    },
    {
        question_id: 22,
        index: 21,
        question: `Are you seeking a position where the company covers dependents (spouse, children) under its medical insurance plan?`,
        answers: {
            1: `No, dependent coverage is not a crucial factor for me`,
            2: `Yes, I'm looking for a company that offers dependent coverage, even if I have to cover a significant portion`,
            3: `Yes, I'm looking for a company that covers a majority of the premium costs for dependents. I'm comfortable with paying the remainder`,
            4: `Yes, I'm looking for a company that covers 100% of the premium costs for dependents`,
        },
    },
    {
        question_id: 23,
        index: 23,
        question: `What is the minimum number of paid time off (PTO) days provided by a company that would still make a job appealing to you?`,
        answers: {
            1: `No PTO required`,
            2: `Less than 10 days`,
            3: `10-15 days`,
            4: `16-20 days`,
            5: `21-25 days`,
            6: `26-30 days`,
            7: `More than 30 days`,
            8: `I'm not sure`
        },
    },
    {
        question_id: 24,
        index: 24,
        question: `What is the most restrictive PTO accrual structure you would accept in a potential job?`,
        answers: {
            1: `Start from Zero: I would accept starting with zero PTO and earning more with each pay period`,
            2: `Baseline Accrual: I would accept starting with a set amount of PTO (not all) and accruing more throughout my tenure`,
            3: `All Up Front: I would need to receive my full annual PTO allotment at the start of each year`,
            4: `Unlimited: I would only consider a company with an unlimited PTO policy`,
        },
    },
    {
        question_id: 25,
        index: 25,
        question: `Would you be willing to work for a company that does not have a 401K program? `,
        answers: {
            1: `No`,
            2: `Yes`,
        },
    },
    {
        question_id: 26,
        index: 26,
        question: `What is the minimum percentage of 401k match offered by a company that would still make a job appealing to you?`,
        answers: {
            1: `I would be willing to work for a company that has no 401k program`,
            2: `Less than 1%`,
            3: `1% - 2%`,
            4: `3% - 4%`,
            5: `5% - 6%`,
            6: `7% - 8%`,
            7: `More than 8%`,
            8: `Only a full (100%) match would be appealing`
        },
    },
    {
        question_id: 26,
        index: 26,
        question: `What is the minimum percentage of dental insurance premium coverage provided by a company that would still make a job offer appealing to you?`,
        answers: {
            1: `I have other means of dental coverage and do not require it from a job`,
            2: `Less than 25%`,
            3: `Between 25% and 50%`,
            4: `Between 50% and 75%`,
            5: `More than 75% but less than 100%`,
            6: `100%`
        },
    },
    {
        question_id: 27,
        index: 27,
        question: `What is the minimum percentage of vision insurance premium coverage provided by a company that would still make a job offer appealing to you?`,
        answers: {
            1: `I have other means of vision coverage and do not require it from a job`,
            2: `Less than 25%`,
            3: `Between 25% and 50%`,
            4: `Between 50% and 75%`,
            5: `More than 75% but less than 100%`,
            6: `100%`
        },
    },
    {
        question_id: 28,
        index: 28,
        question: `What minimum amount of paid maternity/paternity leave would be acceptable to you in a potential job?`,
        answers: {
            1: `No paid leave`,
            2: `Up to 2 weeks paid leave`,
            3: `3-4 weeks paid leave`,
            4: `5-8 weeks paid leave`,
            5: `9-12 weeks paid leave`,
            6: `More than 12 weeks paid leave`,
        },
    },
    {
        question_id: 29,
        index: 29,
        question: `As a new employee, what is the maximum level of restrictiveness on Paid Time Off (PTO) that you would you find acceptable?`,
        answers: {
            1: `No Restrictions: I prefer a role where, as a new employee, I can take PTO at any time, without restrictions`,
            2: `Holiday Blackout Dates: I can accept a role where new employees cannot take PTO during major holidays`,
            3: `Seasonal Peak Business Blackout Dates: I can accept a role where new employees cannot take PTO during the company's peak business seasons`,
            4: `Holiday and Peak Business Blackout Dates: I can accept a role where new employees cannot take PTO during major holidays or the company's peak business seasons`,
        },
    },
    {
        question_id: 30,
        index: 30,
        question: `What is the minimum annual dollar amount of student loan reimbursement that would make a potential employer attractive?`,
        answers: {
            1: `No Assistance Needed`,
            2: `$1 - $1,000`,
            3: `$1,001 - $2,000`,
            4: `$2,001 - $3,000`,
            5: `$3,001 - $4,000`,
            6: `$4,000+`
        },
    },
    {
        question_id: 31,
        index: 31,
        question: `What is the minimum annual learning and development allowance that would make a potential employer attractive?`,
        answers: {
            1: `No Assistance Needed`,
            2: `$1 - $500`,
            3: `$501 - $1,000`,
            4: `$1,001 - $2,000`,
            5: `$2,001 - $3,000`,
            6: `$3,000+`
        },
    },
    {
        question_id: 32,
        index: 32,
        question: `I do not require life insurance benefits from an employer`,
        answers: {
            1: `I do not require life insurance benefits from an employer`,
            2: `Basic Coverage: I expect life insurance that covers an amount equivalent to my annual salary`,
            3: `Enhanced Coverage: I expect life insurance that covers an amount equivalent to double my annual salary`,
            4: `Premium Coverage: I expect life insurance that covers an amount equivalent to triple my annual salary or more`,
        },
    },
    // {
    //     question_id: 21,
    //     index: 21,
    //     question: ``,
    //     answers: {
    //         1: ``,
    //         2: ``,
    //         3: ``,
    //         4: ``,
    //     },
    // },
];
*/
console.log('questions2:', questions2);


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
            const firstUnansweredQuestionIndex = questions.findIndex(question => !selectedAnswers.hasOwnProperty(question.questionID));
            setCurrentQuestionIndex(firstUnansweredQuestionIndex !== -1 ? firstUnansweredQuestionIndex : 0);
        }
        // Disable ESLint warning about exhaustive-deps because I don't want this to run every time selectedAnswers changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasLoaded]);

    return (
        <VStack spacing={4} w='100%' ref={innerRef}>
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
                        {questions[currentQuestionIndex] && Object.entries(questions[currentQuestionIndex].answers).map(([answerID, answer]) => (
                            <Button
                                key={answerID}
                                onClick={() => handleAnswerSelect(questions[currentQuestionIndex].questionID, parseInt(answerID))}
                                minWidth='100%'
                                textAlign='left'
                                justifyContent='flex-start'
                                p={4}
                                h='auto'
                                sx={{
                                    whiteSpace: 'normal',
                                    wordBreak: 'break-word',
                                }}
                                bg={selectedAnswers[questions[currentQuestionIndex].questionID] === parseInt(answerID)
                                    ? '#6be99654'
                                    : 'rgba(255, 255, 255, 0.2)'}
                                borderRadius='md'
                                color='white'
                                borderWidth={selectedAnswers[questions[currentQuestionIndex].questionID] === parseInt(answerID) ? 2 : 1}
                                borderColor={selectedAnswers[questions[currentQuestionIndex].questionID] === parseInt(answerID) ? 'green.300' : 'white'}
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
                                : selectedAnswers.hasOwnProperty(questions[index]?.questionID)
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
            {(Object.keys(selectedAnswers).length >= 2) &&  // TODO Change to >= 20
                <Button colorScheme='orange' rightIcon={<ArrowRightIcon />}
                    as={RouterLink} to={`/candidate/account`} size='lg' mt={5}>
                    See Matches
                </Button>}
        </VStack >
    );
};

export default OnboardingQuestions;
