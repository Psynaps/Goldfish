import React, { useState } from "react";
import Question from "./Question";
import Answer from "./Answer";

const QuestionBank = () => {
    const [questions, setQuestions] = useState([
        {
            questionID: 1,
            category: "Category1",
            tags: ["tag1", "tag2"],
            question: "How would you describe your level of experience with X?",
            answers: [
                {answerID: 1, answer: "Answer1"},
                {answerID: 2, answer: "Answer2"},
                {answerID: 3, answer: "Answer3"},
                {answerID: 4, answer: "Answer4"}
            ]
        },
        {
            questionID: 2,
            category: "Category2",
            tags: ["tag3", "tag4"],
            question: "What are your thoughts on A?",
            answers: [
                {answerID: 1, answer: "Answer1"},
                {answerID: 2, answer: "Answer2"},
                {answerID: 3, answer: "Answer3"},
                {answerID: 4, answer: "Answer4"}
            ]
        },
        {
            questionID: 3,
            category: "Category3",
            tags: ["tag3", "tag4"],
            question: "What are your thoughts on B?",
            answers: [
                {answerID: 1, answer: "Answer1"},
                {answerID: 2, answer: "Answer2"},
                {answerID: 3, answer: "Answer3"},
                {answerID: 4, answer: "Answer4"}
            ]
        },
        {
            questionID: 4,
            category: "Category4",
            tags: ["tag2", "tag3"],
            question: "What are your thoughts on C?",
            answers: [
                {answerID: 1, answer: "Answer1"},
                {answerID: 2, answer: "Answer2"},
                {answerID: 3, answer: "Answer3"},
                {answerID: 4, answer: "Answer4"}
            ]
        },
        {
            questionID: 5,
            category: "Category1",
            tags: ["tag3", "tag5"],
            question: "What are your thoughts on D?",
            answers: [
                {answerID: 1, answer: "Answer1"},
                {answerID: 2, answer: "Answer2"},
                {answerID: 3, answer: "Answer3"},
                {answerID: 4, answer: "Answer4"}
            ]
        },
    ]);

    const [questionsAnswered, setQuestionsAnswered] = useState([]);

    return (
        <div className="QuestionList">
            {questions.map((question) => (
                <Question key={question.questionID} question={question}>
                    <hr/>
                    <div className="answerGrid">
                        {question.answers.map((answer) => (
                            <Answer
                            key={answer.answerID}
                            answerID={answer.answerID}
                            answer={answer.answer}
                            questionID={question.questionID}
                            setQuestionsAnswered={setQuestionsAnswered}
                            />
                        ))}
                    </div>
                </Question>
            ))}
        </div>
    );
};

export default QuestionBank;