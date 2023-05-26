import React from 'react';
import { Button } from "@chakra-ui/react";

const Answer = ({ answer, selectedAnswer, onSelect }) => {
    const isSelected = selectedAnswer === answer;
    // const isSelected2 = selectedAnswer?.answerID === key;
    // console.log(isSelected);
    console.log('selectedAnswer: ', selectedAnswer);
    console.log('answer: ', answer);
    console.log('---------------');
    // console.log('key: ', key, isSelected2);

    const handleClick = (event) => {
        event.stopPropagation();
        onSelect(answer);
    };

    return (
        <Button
            onClick={handleClick}
            // variant={isSelected ? "solid" : "outline"}
            colorScheme={isSelected ? "blue" : "gray"}
        >
            {answer.answer}
        </Button>
    );
};

export default Answer;