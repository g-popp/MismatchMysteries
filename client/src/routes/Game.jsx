import { useEffect, useState } from 'react';
import ChoosePlayer from '../components/ChoosePlayer';
import QuestionCard from '../components/QuestionCard';

const Game = () => {
    const [counter, setCounter] = useState(5);

    useEffect(() => {
        const timer =
            counter > 0 && setInterval(() => setCounter(counter - 1), 1000);

        return () => clearInterval(timer);
    }, [counter]);

    return (
        <div className='flex flex-col gap-20 items-center'>
            <h1 className='text-3xl underline'>Game</h1>
            {counter > 0 ? (
                <h2 className='text-4xl'>Game starts in {counter}</h2>
            ) : (
                <>
                    <QuestionCard />
                    <ChoosePlayer />
                </>
            )}
        </div>
    );
};

export default Game;
