import React, { useState, useEffect } from 'react';
import { Box, VStack } from "@chakra-ui/react";
import Question from './Question';
import Answer from './Answer';

// const QuestionBank = ({ questions, questionBankQuestions, onAddQuestionToJobPosting, selectedCategory, searchTerm, onQuestionSelect: propOnQuestionSelect, onAnswerSelect: propOnAnswerSelect }) => {
const QuestionBank = ({ questions, questionBankQuestions, onAddQuestionToJobPosting, selectedCategory, searchTerm, onQuestionSelect, onAnswerSelect }) => {
    const [selectedQuestion, setSelectedQuestion] = useState(questionBankQuestions[0]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    useEffect(() => {
        setSelectedQuestion(questionBankQuestions[0]);
    }, [questionBankQuestions]);

    useEffect(() => {
        let updatedQuestionBank = questions;

        if (selectedCategory) {
            updatedQuestionBank = updatedQuestionBank.filter(q => q.category === selectedCategory);
        }

        if (searchTerm) {
            const searchWords = searchTerm.split(' ');
            if (searchWords && searchWords.length > 0) {
                updatedQuestionBank = updatedQuestionBank.filter(q => q.tags && Array.isArray(q.tags) && searchWords.some(word => q.tags.some(tag => tag.toLowerCase().includes(word.toLowerCase()))));
            }

            // updating the question bank list
            onAddQuestionToJobPosting(updatedQuestionBank);
        }
    }, [searchTerm, selectedCategory, questions, onAddQuestionToJobPosting]);


    // const onAddQuestionClick = () => {
    //     if (selectedQuestion && selectedAnswer) {
    //         onAddQuestionToJobPosting(selectedQuestion, selectedAnswer);
    //         setSelectedQuestion(null);
    //         setSelectedAnswer(null);
    //     }
    // };

    return (
        <VStack spacing={5} align='stretch' w='100%'>
            {questionBankQuestions.map((question, index) => (
                <Box key={question.questionID} borderBottom='1px' borderColor='gray.200'>
                    <Question
                        question={question}
                        isSelected={selectedQuestion === question}
                        onSelect={() => { setSelectedQuestion(question); onQuestionSelect(question); }}
                        isInitiallyOpen={index === 0}
                    >
                        <VStack align='stretch' mt={5} spacing={4}>
                            {question.answers?.map((answer) => (
                                <Answer
                                    key={`${question.questionID}-${answer.answerID}`}
                                    answer={answer}
                                    selectedAnswer={selectedAnswer}
                                    onSelect={() => { setSelectedAnswer(answer); onAnswerSelect(answer, question); }} // Pass the question here
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