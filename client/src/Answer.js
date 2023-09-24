import React, { useState, useEffect } from 'react';
import { Button, Text } from "@chakra-ui/react";

const Answer = ({ answer, question, selectedAnswers, selectedNonAnswers, onSelect, onNonSelect }) => {
    const isSelected = selectedAnswers?.includes(answer.answerID);
    // const isNonAnswer = selectedNonAnswers?.includes(answer.answerID);

    const handleClick = (event) => {
        event.stopPropagation();
        onSelect(answer, question, isSelected);
    };

    // const handleRightClick = (event) => {
    //     event.preventDefault();
    //     event.stopPropagation();
    //     onNonSelect(event, answer, question, isNonAnswer);
    // };

    return (
        <Button
            onClick={handleClick}
            // onContextMenu={handleRightClick}
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