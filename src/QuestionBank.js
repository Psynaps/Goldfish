import React, { useState } from 'react';
import { Box, VStack } from "@chakra-ui/react";
import Question from './Question';
import Answer from './Answer';

const QuestionBank = ({ selectedCategory, searchTerm, onQuestionSelect, onAnswerSelect, selectedQuestion }) => {
    const [questions] = useState([
        {
            questionID: 1,
            category: 'Technical Knowledge',
            tags: ['tag1', 'tag2', 'X'],
            question: 'How would you describe your level of experience with X?',
            answers: [
                { answerID: 1, answer: 'Answer1' },
                { answerID: 2, answer: 'Answer2' },
                { answerID: 3, answer: 'Answer3' },
                { answerID: 4, answer: 'Answer4' }
            ]
        },
        {
            questionID: 2,
            category: 'Category2',
            tags: ['tag3', 'tag4'],
            question: 'What are your thoughts on A?',
            answers: [
                { answerID: 1, answer: 'Answer1' },
                { answerID: 2, answer: 'Answer2' },
                { answerID: 3, answer: 'Answer3' },
                { answerID: 4, answer: 'Answer4' }
            ]
        },
        {
            questionID: 3,
            category: 'Category3',
            tags: ['tag3', 'tag4'],
            question: 'What are your thoughts on B?',
            answers: [
                { answerID: 1, answer: 'Answer1' },
                { answerID: 2, answer: 'Answer2' },
                { answerID: 3, answer: 'Answer3' },
                { answerID: 4, answer: 'Answer4' }
            ]
        },
        {
            questionID: 4,
            category: 'Category4',
            tags: ['tag2', 'tag3'],
            question: 'What are your thoughts on C?',
            answers: [
                { answerID: 1, answer: 'Answer1' },
                { answerID: 2, answer: 'Answer2' },
                { answerID: 3, answer: 'Answer3' },
                { answerID: 4, answer: 'Answer4' }
            ]
        },
        {
            questionID: 5,
            category: 'Category1',
            tags: ['tag3', 'tag5'],
            question: 'What are your thoughts on D?',
            answers: [
                { answerID: 1, answer: 'Answer1' },
                { answerID: 2, answer: 'Answer2' },
                { answerID: 3, answer: 'Answer3' },
                { answerID: 4, answer: 'Answer4' }
            ]
        },
    ]);

    // const [questionsAnswered, setQuestionsAnswered] = useState([]);
    // const [selectedQuestion, setSelectedQuestion] = useState(null);
    // const [selectedAnswer, setSelectedAnswer] = useState(null);

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
