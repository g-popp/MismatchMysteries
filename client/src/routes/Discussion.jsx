import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import QuestionCard from '../components/QuestionCard';
import { playerAtom } from '../store/players';

const Discussion = () => {
    const [ownPlayer] = useAtom(playerAtom);

    const [counter, setCounter] = useState(5);

    useEffect(() => {
        const timer =
            counter > 0 && setInterval(() => setCounter(counter - 1), 1000);

        return () => clearInterval(timer);
    }, [counter]);

    return (
        <>
            <div className='flex flex-col items-center gap-24'>
                <h1 className='text-2xl underline'>Discussion Round</h1>

                {counter > 0 ? (
                    <h2 className='text-4xl text-center'>
                        Discussion starts in {counter}
                    </h2>
                ) : (
                    <>
                        <h2 className=' flex flex-col gap-8 text-3xl items-center'>
                            You chose:{' '}
                            <span className='text-green-400 text-8xl'>
                                PlayerXY
                            </span>
                        </h2>

                        <div>
                            <h2 className='text-2xl mb-4'>Real Question:</h2>
                            <QuestionCard
                                size={'small'}
                                question='Wer würde am ehesten bei einer Reality-TV-Show mitmachen?'
                            />
                        </div>
                    </>
                )}
            </div>
            {!counter > 0 && ownPlayer?.host && (
                <button
                    className={
                        'text-black text-center text-lg py-2 px-6 border border-black rounded shadow-sm shadow-black bg-zinc-500 mt-14'
                    }
                >
                    Next
                </button>
            )}
        </>
    );
};

export default Discussion;
