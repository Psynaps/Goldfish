import React, { useState } from 'react';
import { Box, VStack, HStack, Text, Select } from "@chakra-ui/react";
import Question from './Question';
import Answer from './Answer';

const JobPostingBank = ({ jobPostingQuestions, onQuestionSelect, onAnswerSelect, onNonAnswerSelect, onImportanceChange }) => {
    const [selectedQuestion, setSelectedQuestion] = useState(jobPostingQuestions[0]);

    return (
        <VStack spacing={5} align='stretch' maxHeight='50vh' overflowY='auto' w='100%'>
            {jobPostingQuestions.map((question, index) => (
                <Box key={question.questionID} borderBottom='1px' borderColor='gray.200'>
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
                            <HStack mt={2}>
                                <Text>Importance:</Text>
                                <Select
                                    defaultValue={question.importance}
                                    onChange={(e) => onImportanceChange(e, question)}
                                    onClick={e => e.stopPropagation()}
                                >
                                    <option value='3'>Required</option>
                                    <option value='2'>Important</option>
                                    <option value='1'>Optional</option>
                                </Select>
                            </HStack>
                            {question.answers?.map((answer) => (
                                <Answer
                                    key={`${question.questionID}-${answer.answerID}`}
                                    answer={answer}
                                    question={question}
                                    selectedAnswers={question.selectedAnswers}
                                    selectedNonAnswers={question.selectedNonAnswers}
                                    onSelect={(answer, question, isSelected) => {
                                        setSelectedQuestion(question);
                                        onQuestionSelect(question);
                                        onAnswerSelect(answer, question, isSelected);
                                    }}
                                    onNonSelect={(e, answer, question, isNonAnswer) => {
                                        setSelectedQuestion(question);
                                        onQuestionSelect(question);
                                        onNonAnswerSelect(e, answer, question, isNonAnswer);
                                    }}
                                />
                            ))}

                        </VStack>
                    </Question>
                </Box>
            ))}
        </VStack>
    );
};

export default JobPostingBank;