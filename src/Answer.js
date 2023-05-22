import React, { useState } from "react";

const Answer = ({ answerID, answer, questionID, setQuestionsAnswered }) => {
    const [selected, setSelected] = useState(false);

    const handleClick = () => {
        setSelected(!selected);

        setQuestionsAnswered(prev => {
            if (!selected) {
                return [...prev, { questionID: questionID, answerIDs: [answerID] }];
            } else {
                return prev.filter(item => item.questionID !== questionID);
            }
        });
    };

    return (
        <button className={`answerButton ${selected ? "selected" : ""}`} onClick={handleClick}>
            {answer}
        </button>
    );
};

export default Answer;
