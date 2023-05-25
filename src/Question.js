import React, { useState } from 'react';
import Collapsible from 'react-collapsible';
import { Box } from "@chakra-ui/react";

const Question = ({ question, children, onSelect, isSelected, isInitiallyOpen }) => {
    const [isOpen, setIsOpen] = useState(isInitiallyOpen);

    const handleClick = () => {
        setIsOpen(!isOpen);
        if (typeof onSelect === 'function') {
            onSelect();
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
