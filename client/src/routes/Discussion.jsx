import { useAtom } from 'jotai';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import { SocketContext } from '../context/socket';
import { playerAtom, selectedPlayerAtom } from '../store/players';
import { questionsAtom } from '../store/questions';

const Discussion = () => {
    const socket = useContext(SocketContext);

    const navigate = useNavigate();

    const [ownPlayer] = useAtom(playerAtom);
    const [selectedPlayer] = useAtom(selectedPlayerAtom);
    const [questions] = useAtom(questionsAtom);

    const [counter, setCounter] = useState(5);

    useEffect(() => {
        if (socket) {
            socket.on('blamePhaseStarted', () => {
                navigate('/blame');
            });

            return () => {
                socket && socket.off('blamePhaseStarted');
            };
        }
    }, [navigate, socket]);

    useEffect(() => {
        const timer =
            counter > 0 && setInterval(() => setCounter(counter - 1), 1000);

        return () => clearInterval(timer);
    }, [counter]);

    const startBlamePhase = () => {
        socket.emit('startBlamePhase');
    };

    return (
        <>
            <div className='flex flex-col items-center gap-24'>
                <h1 className='text-2xl underline'>Discussion Phase</h1>

                {counter > 0 ? (
                    <h2 className='text-4xl text-center'>
                        Discussion starts in {counter}
                    </h2>
                ) : (
                    <>
                        <h2 className=' flex flex-col gap-8 text-3xl items-center'>
                            You chose:{' '}
                            <span className='text-violet-400 text-8xl'>
                                {selectedPlayer && selectedPlayer.name}
                            </span>
                        </h2>

                        <div>
                            <h2 className='text-2xl mb-4'>Real Question:</h2>
                            <QuestionCard
                                size={'small'}
                                question={questions.normalQuestion}
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
                    onClick={() => startBlamePhase()}
                >
                    Next
                </button>
            )}
        </>
    );
};

export default Discussion;
