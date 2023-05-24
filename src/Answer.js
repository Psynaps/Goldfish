import React, { useState } from 'react';
/*
const Answer = ({ answer, questionID, setQuestionsAnswered, setSelectedAnswer }) => {
    const [selected, setSelected] = useState(false);

    const handleClick = () => {
        setSelected(!selected);

        setSelectedAnswer(answer);

        setQuestionsAnswered(prev => {
            if (!selected) {
                return [...prev, { questionID: questionID, answerIDs: [answer.answerID] }];
            } else {
                return prev.filter(item => item.questionID !== questionID);
            }
        });
    };

    return (
        <button className={`answerButton ${selected ? "selected" : ""}`} onClick={handleClick}>
            {answer.answer}
        </button>
    );
};

export default Answer;
*/

const Answer = ({ answer, onSelect }) => {
    const [selected, setSelected] = useState(false);

    const handleClick = () => {
        setSelected(!selected);
        onSelect(answer);
    };

    return (
        <button className={`answerButton ${selected ? "selected" : ""}`} onClick={handleClick}>
            {answer.answer}
        </button>
    );
};

export default Answer;
