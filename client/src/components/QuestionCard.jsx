import { useState } from 'react';

const QuestionCard = ({ question }) => {
    const headingColors = [
        'bg-[#FF9B71]',
        'bg-[#1B998B]',
        'bg-[#FFFD82]',
        'bg-[#E84855]'
    ];
    const randomColor =
        headingColors[Math.floor(Math.random() * headingColors.length)];
    const [color] = useState(randomColor);
    return (
        <div
            className={`w-full border border-black px-12 py-24 ${color} rounded-lg shadow-xl`}
        >
            <h2 className='text-2xl text-center text-black'>{question}</h2>
        </div>
    );
};

export default QuestionCard;
