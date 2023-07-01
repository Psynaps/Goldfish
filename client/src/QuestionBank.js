import React, { useState, useEffect } from 'react';
import { Box, VStack } from "@chakra-ui/react";
import Question from './Question';
import Answer from './Answer';
const QuestionBank = ({ questionBankQuestions, selectedCategory, searchTerm, onQuestionSelect, onAnswerSelect, onNonAnswerSelect, selectedAnswers, selectedNonAnswers }) => {
    const [selectedQuestion, setSelectedQuestion] = useState(questionBankQuestions[0]);

    let displayedQuestions = questionBankQuestions;
    if (selectedCategory) {
        displayedQuestions = displayedQuestions.filter(q => q.category === selectedCategory);
    }

    if (searchTerm) {
        const searchWords = searchTerm.split(' ');
        if (searchWords && searchWords.length > 0) {
            displayedQuestions = displayedQuestions.filter(q => q.tags && Array.isArray(q.tags) && searchWords.some(word => q.tags.some(tag => tag.toLowerCase().includes(word.toLowerCase()))));
        }
    }

    useEffect(() => {
        setSelectedQuestion(displayedQuestions[0]);
    }, [questionBankQuestions, displayedQuestions]);

    return (
        <VStack spacing={5} align='stretch' maxHeight='50vh' overflowY='auto' w='100%'>
            {displayedQuestions.map((question, index) => (
                <Box key={question.questionID} borderBottom='1px' borderColor='gray.200'>
                    <Question
                        question={question}
                        isSelected={selectedQuestion === question}
                        onSelect={() => { setSelectedQuestion(question); onQuestionSelect(question); }}
                        isInitiallyOpen={index === 0}
                    >
                        <VStack align='stretch' mt={5} spacing={3}>
                            {question.answers?.map((answer) => (
                                <Answer
                                    key={`${question.questionID}-${answer.answerID}`}
                                    answer={answer}
                                    selectedAnswers={selectedAnswers}
                                    selectedNonAnswers={selectedNonAnswers}
                                    onSelect={(answer) => {
                                        onAnswerSelect(answer, question);
                                    }}
                                    onNonSelect={(e, answer) => {
                                        onNonAnswerSelect(e, answer, question);
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

export default QuestionBank;