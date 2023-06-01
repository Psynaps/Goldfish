import React from 'react';
import { Button, Text } from "@chakra-ui/react";

const Answer = ({ answer, selectedAnswer, onSelect }) => {
    const isSelected = selectedAnswer === answer;

    const handleClick = (event) => {
        event.stopPropagation();
        onSelect(answer);
    };

    return (
        <Button
            onClick={handleClick}
            colorScheme={isSelected ? "blue" : "gray"}
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