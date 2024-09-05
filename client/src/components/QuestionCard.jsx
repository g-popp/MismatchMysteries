import { useState } from 'react';

const QuestionCard = ({ question, size }) => {
    const headingColors = [
        'bg-[#FF9B71]',
        'bg-[#1B998B]',
        'bg-[#FFFD82]',
        'bg-[#E84855]'
    ];
    const randomColor =
        headingColors[Math.floor(Math.random() * headingColors.length)];
    const [color] = useState(randomColor);

    const defaultSize = `w-full border border-black px-8 py-12 ${color} rounded-lg shadow-xl`;

    const smallSize = `w-full border border-black px-6 py-8 ${color} rounded-lg shadow-xl`;

    return (
        <div className={size === 'small' ? smallSize : defaultSize}>
            <h2 className='text-xl text-center text-black'>{question}</h2>
        </div>
    );
};

export default QuestionCard;
