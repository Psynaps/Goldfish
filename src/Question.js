import React, { useState } from 'react';
import Collapsible from 'react-collapsible';

const Question = ({ question, children, onSelect, isSelected }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        if (typeof onSelect === 'function') {
            onSelect();
        }
    };

    return (
        <div onClick={handleClick} className={`Question ${isSelected ? 'selected' : ''}`}>

            <Collapsible trigger={question.question} open={isOpen} onOpening={() => setIsOpen(true)} onClosing={() => setIsOpen(false)}>
                {children}
            </Collapsible>
        </div>
    );
};

export default Question;
