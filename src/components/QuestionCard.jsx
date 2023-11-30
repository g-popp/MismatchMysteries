import { useState } from 'react';

const QuestionCard = () => {
    const headingColors = ['#FF9B71', '#1B998B', '#FFFD82', '#E84855'];
    const randomColor =
        headingColors[Math.floor(Math.random() * headingColors.length)];
    const [color] = useState(randomColor);
    return (
        <div
            className={`w-full border border-black px-12 py-24 bg-[${color}] rounded-lg shadow-xl`}
        >
            <h2 className='text-2xl text-center text-black'>
                Which player is most likely to drive drunk?
            </h2>
        </div>
    );
};

export default QuestionCard;
