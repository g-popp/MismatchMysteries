import { useAtom } from 'jotai';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { SocketContext } from '../context/socket';
import { gameIdAtom } from '../store/game';
import { allPlayersAtom, playerAtom } from '../store/players';
import { questionsAtom } from '../store/questions';

const Reveal = () => {
    const socket = useContext(SocketContext);
    const navigate = useNavigate();

    const [counter, setCounter] = useState(5);
    const [youWon, setYouWon] = useState(false);
    const [gameId] = useAtom(gameIdAtom);

    const [allPlayers] = useAtom(allPlayersAtom);
    const [ownPlayer] = useAtom(playerAtom);

    const [questions] = useAtom(questionsAtom);

    const [imposter, setImposter] = useState(null);

    const startNextRound = () => {
        socket && socket.emit('startNextRound');
    };

    useEffect(() => {
        const timer =
            counter > 0 && setInterval(() => setCounter(counter - 1), 1000);

        return () => clearInterval(timer);
    }, [counter]);

    useEffect(() => {
        console.log('allPlayers', allPlayers);
        console.log('ownPlayer', ownPlayer);

        setImposter([...allPlayers, ownPlayer].find(player => player.imposter));

        if (socket) {
            socket.on('revealResult', result => {
                setYouWon(
                    result === 'imposterWon'
                        ? ownPlayer.imposter
                        : !ownPlayer.imposter
                );
            });

            socket.on('nextRoundStarted', () => {
                navigate(`/newGame/${gameId}`);
            });

            return () => {
                socket.off('revealResult');
                socket.off('nextRoundStarted');
            };
        }
    }, [allPlayers, gameId, navigate, ownPlayer, socket, youWon]);

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
                                youWon ? 'text-green-400' : 'text-red-400'
                            } text-8xl`}
                        >
                            {imposter?.name}
                        </span>
                    </h2>
                    <h2 className=' flex flex-col gap-8 text-3xl items-center'>
                        {youWon ? 'You won!' : 'You lost!'}
                    </h2>

                    <div>
                            <h2 className='text-2xl mb-4'>Imposter Question:</h2>
                            <QuestionCard
                                size={'small'}
                                question={questions.imposterQuestion}
                            />
                    </div>

                    {ownPlayer?.host && (
                        <Button
                            handler={() => startNextRound()}
                            color='#FF9B71'
                            className='text-black text-xl py-4 px-6 border border-black rounded shadow-sm shadow-black'
                        >
                            Next Game
                        </Button>
                    )}
                </>
            )}
        </div>
    );
};

export default Reveal;
