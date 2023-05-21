import React, { useState } from "react";
import Collapsible from 'react-collapsible';

const Question = ({ question, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Collapsible trigger={question.question} open={isOpen} onOpening={() => setIsOpen(true)} onClosing={() => setIsOpen(false)}>
            {children}
        </Collapsible>
    );
};

export default Question;
