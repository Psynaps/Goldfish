import React, { useState, useEffect } from 'react';
import Collapsible from 'react-collapsible';
import { Box } from "@chakra-ui/react";

const Question = ({ question, children, onSelect, isSelected, isInitiallyOpen, isQuestionBankQuestion }) => {
    const [isOpen, setIsOpen] = useState(isInitiallyOpen);
    // const [justSelected, setJustSelected] = useState(false);

    const handleClick = () => {
        if (isOpen && !isSelected) {
            onSelect();
        } else if (isOpen && isSelected) {
            setIsOpen(false);
        } else {
            onSelect();
            setIsOpen(true);
        }
    };

    const handleTriggerClick = (e) => {
        e.stopPropagation(); // prevent event from bubbling up to the Box onClick
        handleClick();
    };

    return (
        <Box
            onClick={handleClick}
            borderWidth={isSelected ? "4px" : "3px"}
            borderColor={isSelected ? (isQuestionBankQuestion ? "blue.500" : 'orange.500') : "gray.200"}
            borderRadius="md"
            p={4}
            _hover={{ bg: "gray.100" }}
            cursor="pointer"
        >
            <Collapsible
                trigger={<div onClick={handleTriggerClick}>{question.question}</div>}
                triggerWhenOpen={<div onClick={handleTriggerClick}>{question.question}</div>}
                triggerWhenClosed={<div onClick={handleTriggerClick}>{question.question}</div>}
                open={isOpen}
            >
                {children}
            </Collapsible>
        </Box>
    );
};

export default Question;
