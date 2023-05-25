import React, { useState } from 'react';
import { Button } from "@chakra-ui/react";

const Answer = ({ answer, onSelect }) => {
    const [selected, setSelected] = useState(false);

    const handleClick = (event) => {
        event.stopPropagation();
        setSelected(!selected);
        onSelect(answer);
    };

    return (
        <Button
            onClick={handleClick}
            variant={selected ? "solid" : "outline"}
            colorScheme={selected ? "blue" : "gray"}
        >
            {answer.answer}
        </Button>
    );
};

export default Answer;
