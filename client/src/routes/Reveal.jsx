import { useEffect, useState } from 'react';

const Reveal = () => {
    const [counter, setCounter] = useState(5);
    const [won] = useState(false);

    useEffect(() => {
        const timer =
            counter > 0 && setInterval(() => setCounter(counter - 1), 1000);

        return () => clearInterval(timer);
    }, [counter]);

    return (
        <div className='flex flex-col gap-20 items-center'>
            <h1 className='text-3xl underline'>Reveal Phase</h1>
            {counter > 0 ? (
                <h2 className='text-4xl'>Reveal in {counter}</h2>
            ) : (
                <>
                    <h2 className=' flex flex-col gap-8 text-3xl items-center'>
                        The Mismatch is:{' '}
                        <span
                            className={`${
                                won ? 'text-green-400' : 'text-red-400'
                            } text-8xl`}
                        >
                            {'PlayerXY'}
                        </span>
                    </h2>
                    <h2 className=' flex flex-col gap-8 text-3xl items-center'>
                        {won ? 'You won!' : 'You lost!'}
                    </h2>
                </>
            )}
        </div>
    );
};

export default Reveal;
