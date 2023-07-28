import React, { useState, useEffect, useRef } from 'react';
import { VStack, HStack, Button, ButtonGroup, Box, Text, Heading } from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

// Mock data
const questions = [
    {
        question_id: 1,
        question: 'Question 1?',
        answers: {
            1: 'Answer 1',
            2: `Answer 2 text that gets a lot longer than I expected it to be. Like, a lot longer. 
            Like a lot a lot. Like, I'm not sure if this is a good idea.
             Please let me know if this breaks anything`,
            3: 'Answer 3',
            4: 'Answer 4',
        },
    },
    {
        question_id: 2,
        question: 'Question 2?',
        answers: {
            1: 'Answer 11',
            2: 'Answer 22',
            3: 'Answer 33',
            4: 'Answer 44',
        },
    },
    {
        question_id: 3,
        question: 'Question 2?',
        answers: {
            1: 'Answer 11',
            2: 'Answer 22',
            3: 'Answer 33',
            4: 'Answer 44',
        },
    },
    {
        question_id: 4,
        question: 'Question 2?',
        answers: {
            1: 'Answer 11',
            2: 'Answer 22',
            3: 'Answer 33',
            4: 'Answer 44',
        },
    },
    {
        question_id: 5,
        question: 'Question 2?',
        answers: {
            1: 'Answer 11',
            2: 'Answer 22',
            3: 'Answer 33',
            4: 'Answer 44',
        },
    },
    // Add more questions as needed...
];

const OnboardingQuestions = ({ apiURL, selectedAnswers, setSelectedAnswers, hasLoaded, innerRef }) => {
    const { user, isAuthenticated } = useAuth0();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const timeoutId = useRef(null); // Keep reference to the timeout
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
        <VStack spacing={4} w='100%' ref={innerRef}>
            <Box w='80%'>
                <Box borderRadius='md' color='white' borderColor='white' borderWidth={2} p={2}>
                    <Heading as='h2' size='lg' >
                        {questions[currentQuestionIndex] ? questions[currentQuestionIndex].question : null}
                    </Heading>
                </Box>
                <ButtonGroup variant='outline' isAttached w='100%' p={19} pl={35} >
                    <VStack w='100%'>
                        {questions[currentQuestionIndex] && Object.entries(questions[currentQuestionIndex].answers).map(([answer_id, answer]) => (
                            <Button
                                key={answer_id}
                                onClick={() => handleAnswerSelect(questions[currentQuestionIndex].question_id, parseInt(answer_id))}
                                minWidth='100%'
                                textAlign='left'
                                justifyContent='flex-start'
                                p={3}
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
                                <Text> {answer} </Text>
                            </Button>
                        ))}
                    </VStack>
                </ButtonGroup>
            </Box>

            <HStack spacing={3} alignSelf='center'>
                {questions.map((_, index) => (
                    <Button
                        key={index}
                        onClick={() => setCurrentQuestionIndex(index)}
                        bg={currentQuestionIndex === index
                            ? 'green.300'
                            : selectedAnswers.hasOwnProperty(questions[index].question_id)
                                ? '#6be99654'
                                : 'rgba(255, 255, 255, 0.2)'}
                        // colorScheme={(currentQuestionIndex === index || selectedAnswers.hasOwnProperty(questions[index].question_id)) ? 'green' : 'gray'}
                        _hover={{ bg: 'green.300' }}
                        borderRadius='full'
                        borderWidth={1}
                        borderColor='white'
                    >
                    </Button>
                ))}
            </HStack>
        </VStack>
    );
};

export default OnboardingQuestions;
