import React, { useState } from 'react';
import { Box, VStack, HStack, Text, Select } from "@chakra-ui/react";
import Question from './Question';
import Answer from './Answer';

const JobPostingBank = ({ jobPostingQuestions, onQuestionSelect, onAnswerSelect }) => {
    const [selectedQuestion, setSelectedQuestion] = useState(jobPostingQuestions[0]);

    return (
        <VStack spacing={4} align='stretch' maxHeight='50vh' overflowY='auto' w='100%'>
            <Text mt={0} fontSize='lg' fontFamily='Inter' textDecoration='underline'>Important</Text>
            <VStack spacing={4} align='stretch' w='100%' p={3} bg='blue.600' borderColor='orange.600' borderWidth='3px' borderStyle='dashed' borderRadius='xl'>

                {jobPostingQuestions.filter(q => q.importance === 2).map((question, index) => (
                    <Box key={question.questionID} bg='blue.400' borderRadius='2xl' _hover={{ bg: "blue.500" }}>
                        <Question
                            question={question}
                            isSelected={selectedQuestion === question}
                            onSelect={() => {
                                if (selectedQuestion !== question) {
                                    setSelectedQuestion(question);
                                    onQuestionSelect(question);
                                }
                            }}
                            isInitiallyOpen={index === 0}
                            isQuestionBankQuestion={false}
                        >
                            <VStack align='stretch' mt={5} spacing={3}>
                                {question.answers?.map((answer) => (
                                    <Answer
                                        key={`${question.questionID}-${answer.answerID}`}
                                        answer={answer}
                                        question={question}
                                        selectedAnswers={question.selectedAnswers}
                                        onSelect={(answer, question, isSelected) => {
                                            // if (isSelected) return; // Prevents deselecting the already selected answer
                                            setSelectedQuestion(question);
                                            onQuestionSelect(question);
                                            onAnswerSelect(answer, question, isSelected);
                                        }}
                                    />
                                ))}

                            </VStack>
                        </Question>
                    </Box>
                ))}
            </VStack>

            <Text mt={6} mb={2} fontSize='lg' fontFamily='Inter' textDecoration='underline'>Nice to Have</Text>
            <VStack spacing={4} align='stretch' w='100%' p={3} bg='blue.600' borderColor='orange.600' borderWidth='3px' borderStyle='dashed' borderRadius='xl'>
                {jobPostingQuestions.filter(q => q.importance === 1).map((question, index) => (
                    <Box key={question.questionID} bg='blue.400' borderRadius='2xl'>
                        <Question
                            question={question}
                            isSelected={selectedQuestion === question}
                            onSelect={() => {
                                if (selectedQuestion !== question) {
                                    setSelectedQuestion(question);
                                    onQuestionSelect(question);
                                }
                            }}
                            isInitiallyOpen={index === 0}
                            isQuestionBankQuestion={false}
                        >
                            <VStack align='stretch' mt={5} spacing={3}>
                                {question.answers?.map((answer) => (
                                    <Answer
                                        key={`${question.questionID}-${answer.answerID}`}
                                        answer={answer}
                                        question={question}
                                        selectedAnswers={question.selectedAnswers}
                                        onSelect={(answer, question, isSelected) => {
                                            setSelectedQuestion(question);
                                            onQuestionSelect(question);
                                            onAnswerSelect(answer, question, isSelected);
                                        }}
                                    />
                                ))}

                            </VStack>
                        </Question>
                    </Box>
                ))}
            </VStack>

        </VStack >
    );
};

export default JobPostingBank;