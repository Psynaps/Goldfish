import React, { useState, useEffect, useCallback } from 'react';
import { Stack, HStack, VStack, Box, Text, Select, Collapse, Circle, Input, Button, Icon, Heading, Flex, SimpleGrid, } from '@chakra-ui/react';
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import { LoginButton } from './LoginButton';
// import { Link as ChakraLink } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import { questionsData } from './QuestionsData';

const categories = ['Industry Certifications', 'Technical Knowledge', 'Deal Experience', 'Tools & Platforms', 'HR Preferences',
    'Job Specific HR',];

function CandidateProfilePage({ apiURL, userProfile, userAnswers, setUserAnswers, hasLoadedProfile }) {
    const { isAuthenticated, isLoading, user } = useAuth0();
    const [selectedCategory, setSelectedCategory] = useState(null);
    // const [questionBank, setQuestionBank] = useState(null);
    const [hasLoadedQuestions, setHasLoadedQuestions] = useState(false);
    // const [answered, setAnswered] = useState({});
    const [answeredQuestions, setAnsweredQuestions] = useState([]);

    const [expandedQuestionID, setExpandedQuestionID] = useState(null);
    const [currentQuestionAnswer, setCurrentQuestionAnswer] = useState(null);
    const [displayedQuestions, setDisplayedQuestions] = useState([]);

    function QuestionCard({ question }) {
        const [selectedAnswer, setSelectedAnswer] = useState(null);
        const [isExpanded, setIsExpanded] = useState(false);

        return (
            <Box w='100%' bg='blue.700' flex='1 1 auto'>
                <Button w='100%' onClick={() => {
                    setExpandedQuestionID(question.questionID);
                    setCurrentQuestionAnswer(null);
                }}>
                    <Text fontSize='md'>
                        {question.question}
                    </Text>
                </Button>
                <Collapse in={expandedQuestionID === question.questionID} w='100%' align='stretch'>
                    {question.answers.length > 4 && (
                        <SimpleGrid columns={2} spacing={2} pt={4} w='100%' h='100%' maxHeight='100%' bg='blue.500'>
                            {question.answers.map(answer => (
                                <Button
                                    // key={answer.answerID}
                                    key={`${question.questionID}-${answer.answerID}:${userAnswers[question.questionID]}`}
                                    // key={`${question.questionID}-${answer.answerID}$-${userAnswers[question.questionID]}`}
                                    w='100%'
                                    colorScheme={((expandedQuestionID === question.questionID) && (currentQuestionAnswer === answer.answerID)) ? 'blue' : 'gray'}
                                    onClick={() => {
                                        // setCurrentQuestionAnswer(answer.answerID);
                                        handleAnswerSelect(answer.answerID);
                                    }}
                                >
                                    <Text fontSize='sm'>
                                        {answer.answer}
                                    </Text>
                                </Button>
                            ))}
                        </SimpleGrid>
                    )}
                    {question.answers.length <= 4 && (
                        <VStack w='100%' justify='center' pt={4} h='100%' maxHeight='100%' bg='blue.500'>
                            {question.answers.map(answer => (
                                <Button
                                    key={answer.answerID}
                                    w='100%'
                                    colorScheme={(expandedQuestionID === question.questionID && currentQuestionAnswer === answer.answerID) ? 'blue' : 'gray'}
                                    onClick={() => {
                                        setCurrentQuestionAnswer(answer.answerID);
                                        handleAnswerSelect(answer.answerID);
                                    }}
                                >
                                    <Text fontSize='sm'>
                                        {answer.answer}
                                    </Text>
                                </Button>
                            ))}
                        </VStack>)}
                </Collapse>
            </Box>
        );
    }













    const sortQuestionBankQuestions = (questions) => {
        return questions;
    };


    const handleAnswerSelect = async (answerID) => {
        if (expandedQuestionID && answerID) {
            // console.log('trigger2', answerID, expandedQuestionID);
            console.log('expandedQuestionID: ', expandedQuestionID);
            // console.log('currentQuestionAnswer: ', currentQuestionAnswer);

            try {
                const response = await axios.post(`${apiURL}/setUserAnswer`, {
                    user_id: user.sub, // Assuming this holds the Auth0 user ID. Adjust accordingly.
                    question_id: expandedQuestionID,
                    answer_id: answerID,
                });

                if (response.data.message) {
                    console.log(response.data.message);
                }

                let newAnswered = { ...userAnswers, [expandedQuestionID]: answerID };
                // console.log('newAnswered: ', newAnswered);
                // setAnswered(newAnswered);
                setUserAnswers(newAnswered);
                // setExpandedQuestionID(null);
                setCurrentQuestionAnswer(answerID);
                // setIsAnswerSelected(false);
            } catch (error) {
                console.error('Error saving answer: ', error);
            }
        }
    };


    // const filterQuestions = useCallback(() => {
    // }, [selectedCategory, searchTerm, answered]);

    useEffect(() => {
        let newDisplayedQuestions = questionsData;

        if (selectedCategory) {
            newDisplayedQuestions = newDisplayedQuestions.filter(q => q.category === selectedCategory);
        }

        //filter questions to only display those answered already
        if (userAnswers !== null && Object.keys(userAnswers).length > 0) {
            newDisplayedQuestions = newDisplayedQuestions.filter(q => userAnswers.hasOwnProperty(q.questionID));
        }

        setDisplayedQuestions(newDisplayedQuestions);
    }, [selectedCategory, userAnswers]);

    useEffect(() => {
        // setSele(answered[expandedQuestionID]);
        if (userAnswers[expandedQuestionID]) {
            setCurrentQuestionAnswer(userAnswers[expandedQuestionID]);
        }
        else {
            setCurrentQuestionAnswer(null);
        }
    }, [expandedQuestionID]);


    // useEffect(() => {
    //     if (questionsData) {
    //         // 	}
    //         let newDisplayedQuestions = sortQuestionBankQuestions(questionsData);
    //         setDisplayedQuestions(questionsData);
    //     }

    // }, [questionsData]);

    // set answers to those from user profile
    // useEffect(() => {
    //     // console.log('test1');
    //     if (hasLoadedProfile && userProfile && userAnswers) {
    //         let newAnswered = {};
    //         Object.entries(userAnswers).forEach((questionID, answerID) => {
    //             newAnswered[questionID] = answerID;
    //             // answeredQuestions.push(questionID);
    //         });

    //         // setAnswered(newAnswered);
    //         console.log('newAnswered: ', newAnswered);
    //     }
    // }, [hasLoadedProfile, userProfile]);

    // if (searchTerm) {
    //   const searchWords = searchTerm.split(' ');
    //   if (searchWords && searchWords.length > 0) {
    //     displayedQuestions = displayedQuestions.filter(q => q.tags && Array.isArray(q.tags) && searchWords.some(word => q.tags.some(tag => tag.toLowerCase().includes(word.toLowerCase()))));
    //   }
    // }
    return (
        <Flex
            justify="flex-start"
            align="flex-start"
            spacing="0px"
            direction='column'
            // overflow="scroll"
            // width="1280px"
            paddingStart="64px"
            paddingEnd="32px"
            paddingTop="80px"
            w='100%'
            h='100%'
        // alignSelf='stretch'
        >
            <VStack
                justify="center"
                align="flex-start"
                // flex="1"
                flex='1 1 auto'
                alignSelf="stretch"
                w='60%'
            // bg='red'
            >
                <Stack
                    justify="flex-start"
                    align="flex-start"
                    flex="1"
                    alignSelf="stretch"
                >
                    <Text
                        fontFamily="Inter"
                        lineHeight="1.2"
                        fontWeight="bold"
                        fontSize="xl"
                        color="white"
                        w='100%'
                    >
                        ‘Talent is the sum of a person’s abilities.’ -A. Duckworth
                    </Text>

                    <Text
                        fontFamily="Inter"
                        lineHeight="1.2"
                        fontSize='md'
                        color='pink.500'
                        mt={2}
                    >
                        Let us know if we got yours down right.
                    </Text>

                    <Flex direction='row' alignItems='baseline' w='100%'>
                        <Text pt='24px' pr={4} fontSize='lg' align='stretch' color='white'>
                            Question Category:
                        </Text>
                        <Select id="producttype" flex='1'
                            defaultValue={""}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                console.log('selected category: ' + e.target.value);
                            }}
                        >
                            <option value="" >---</option>
                            {categories.map((category) => (<option value={category} key={category}>{category}</option>))}
                        </Select>
                    </Flex>
                </Stack>

                {/* <VStack w='100%' bg='red' spacing={5} align='stretch' h='100%' overflowY='auto' >
        </VStack > */}
            </VStack >
            <VStack
                justify="center"
                align="flex-start"
                flex="1 1 auto"
                alignSelf="stretch"
                w='100%'
                // h='auto'
                maxHeight='85vh'
                pt={4}
            // bg='blue'

            >

                <VStack w='100%' spacing={4} overflowY='auto' >
                    {displayedQuestions.map(question => (
                        <QuestionCard key={question.questionID} question={question} onConfirm={setAnsweredQuestions} />
                    ))}
                </VStack>

            </VStack>
        </Flex >
    );
}

export default CandidateProfilePage;
