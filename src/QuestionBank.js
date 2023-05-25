import React, { useState, useEffect } from 'react';
import { Box, VStack } from "@chakra-ui/react";
import Question from './Question';
import Answer from './Answer';
// import { questionsData } from './QuestionsData';

const QuestionBank = ({ questions, selectedCategory, searchTerm, onQuestionSelect, onAnswerSelect, selectedQuestion, selectedAnswer }) => {

    const filteredQuestions = questions.filter(question => {
        // Check if a category is selected, and if so, filter questions that don't belong to it
        if (selectedCategory && question.category !== selectedCategory) {
            return false;
        }

        // Split the search term into words and check if any of the question's tags include these words
        const searchWords = searchTerm.split(' ');
        if (!searchWords.some(word => question.tags.some(tag => tag.toLowerCase().includes(word.toLowerCase())))) {
            return false;
        }

        return true;
    });

    useEffect(() => {
        if (filteredQuestions.length > 0) {
            onQuestionSelect(filteredQuestions[0]);
        }
    }, [filteredQuestions]);

    return (
        <VStack spacing={5} align='stretch' w='100%'>
            {filteredQuestions.map((question, index) => (
                <Box key={question.questionID} borderBottom='1px' borderColor='gray.200'>
                    <Question
                        key={question.questionID}
                        question={question}
                        isSelected={selectedQuestion === question}
                        onSelect={() => onQuestionSelect(question)}
                        isInitiallyOpen={index === 0}
                    >
                        <VStack align='stretch' mt={5} spacing={4}>
                            {question.answers.map((answer) => (
                                <Answer
                                    key={answer.answerID}
                                    answer={answer}
                                    selectedAnswer={selectedQuestion === question ? selectedAnswer : null}
                                    onSelect={() => onAnswerSelect(answer)}
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
