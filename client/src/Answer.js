import React from 'react';
import { Button, Text } from "@chakra-ui/react";

const Answer = ({ answer, selectedAnswers, selectedNonAnswers, onSelect, onNonSelect }) => {
    const isSelected = selectedAnswers.includes(answer.answerID);
    const isNonAnswer = selectedNonAnswers.includes(answer.answerID);

    const handleClick = (event) => {
        event.stopPropagation();
        onSelect(answer);
    };

    const handleRightClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        onNonSelect(event, answer); // Pass event as the first argument
    };

    return (
        <Button
            onClick={handleClick}
            onContextMenu={handleRightClick}
            colorScheme={isNonAnswer ? "red" : (isSelected ? "blue" : "gray")}
            height='auto'
            blockSize='auto'
            whiteSpace='normal'
            p={2}
        >
            <Text>{answer.answer}</Text>
        </Button>
    );
};

export default Answer;