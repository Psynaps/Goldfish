import React, { useState, useEffect } from 'react';
import Collapsible from 'react-collapsible';
import { Box } from "@chakra-ui/react";

const Question = ({ question, children, onSelect, isSelected, isInitiallyOpen }) => {
    const [isOpen, setIsOpen] = useState(isInitiallyOpen);
    // const [justSelected, setJustSelected] = useState(false);

    const handleClick = () => {
        // If the question is already open but not selected, then select it and don't close it.
        // Otherwise if the question is already open and selected, then close it and keep it selected.
        // Otherwise if the question is closed, then open it and select it.
        if (isOpen && !isSelected) {
            onSelect();
            console.log("case 1");
        }
        else if (isOpen && isSelected) {
            setIsOpen(false);
            console.log("case 2");
        }
        else {
            onSelect();
            setIsOpen(true);
            console.log("case 3");
        }

    };


    return (
        <Box
            onClick={handleClick}
            borderWidth={isSelected ? "4px" : "3px"}
            borderColor={isSelected ? "blue.500" : "gray.200"}
            borderRadius="md"
            p={4}
            _hover={{ bg: "gray.100" }}
            cursor="pointer"
        >
            <Collapsible
                trigger={question.question}
                triggerWhenOpen={question.question}
                triggerWhenClosed={question.question}
                open={isOpen}
            >
                {children}
            </Collapsible>
        </Box>
    );
};

export default Question;
