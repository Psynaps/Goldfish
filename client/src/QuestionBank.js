import React, { useState } from 'react';
import { Box, VStack } from "@chakra-ui/react";
import Question from './Question';
import Answer from './Answer';
const QuestionBank = ({ questionBankQuestions, selectedCategory, searchTerm, onQuestionSelect, onAnswerSelect }) => {
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

    // useEffect(() => {
    //     setSelectedQuestion(displayedQuestions[0]);
    // }, [questionBankQuestions, displayedQuestions]);

    return (
        <VStack spacing={5} align='stretch' maxHeight='50vh' overflowY='auto' w='100%'>
            {displayedQuestions.map((question, index) => (
                <Box key={question.questionID}>
                    <Question
                        question={question}
                        isSelected={selectedQuestion === question}
                        onSelect={() => {
                            if (selectedQuestion !== question) {
                                console.log('selected question', question);
                                setSelectedQuestion(question);
                                onQuestionSelect(question);
                            }
                        }}
                        isInitiallyOpen={index === 0}
                        isQuestionBankQuestion={true}
                    >
                        <VStack align='stretch' mt={5} spacing={3}>
                            {question.employerAnswers?.map((answer) => (
                                <Answer
                                    key={`${question.questionID}-${answer.answerID}`}
                                    answer={answer}
                                    question={question}
                                    selectedAnswers={question.selectedAnswers}
                                    // selectedNonAnswers={question.selectedNonAnswers}
                                    onSelect={(answer, question, isSelected) => {
                                        setSelectedQuestion(question);
                                        onQuestionSelect(question);
                                        onAnswerSelect(answer, question, isSelected);
                                    }}
                                // onNonSelect={(e, answer, question, isNonAnswer) => {
                                //     setSelectedQuestion(question);
                                //     onQuestionSelect(question);
                                //     onNonAnswerSelect(e, answer, question, isNonAnswer);
                                // }}
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