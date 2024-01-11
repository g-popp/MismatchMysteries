import { useAtom } from 'jotai';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import QuestionCard from '../components/QuestionCard';
import { SocketContext } from '../context/socket';
import { gameIdAtom } from '../store/game';
import { allPlayersAtom, playerAtom } from '../store/players';
import { questionsAtom } from '../store/questions';

const Reveal = () => {
    const socket = useContext(SocketContext);
    const navigate = useNavigate();

    const [questions] = useAtom(questionsAtom);

    const [counter, setCounter] = useState(5);
    const [youWon, setYouWon] = useState(false);
    const [gameId] = useAtom(gameIdAtom);

    const [allPlayers] = useAtom(allPlayersAtom);

    const [ownPlayer] = useAtom(playerAtom);
    const ownPlayerRef = useRef(ownPlayer);
    ownPlayerRef.current = ownPlayer;

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
        setImposter([...allPlayers, ownPlayer].find(player => player.imposter));
    }, [allPlayers, ownPlayer]);

    useEffect(() => {
        if (socket) {
            const onRevealResult = result => {
                if (result === 'defaultsWon') {
                    setYouWon(!ownPlayerRef.current.imposter);
                } else if (result === 'imposterWon') {
                    setYouWon(ownPlayerRef.current.imposter);
                }
            };

            const onNextRoundStarted = () => {
                navigate(`/newGame/${gameId}`);
            };

            socket.on('revealResult', onRevealResult);
            socket.on('nextRoundStarted', onNextRoundStarted);

            return () => {
                socket.off('revealResult', onRevealResult);
                socket.off('nextRoundStarted', onNextRoundStarted);
            };
        }
    }, [socket, ownPlayerRef.current, gameId, navigate]);

    const revealCountdown = counter > 0;
    const revealText = youWon ? 'You won!' : 'You lost!';
    const revealColor = youWon ? 'text-green-400' : 'text-red-400';
    const nextGameButton = ownPlayer?.host && (
        <Button
            handler={() => startNextRound()}
            color='#FF9B71'
            className='text-black text-xl py-4 px-6 border border-black rounded shadow-sm shadow-black'
        >
            Next Game
        </Button>
    );

    return (
        <div className='flex flex-col gap-20 items-center'>
            <h1 className='text-3xl underline'>Reveal Phase</h1>
            {revealCountdown ? (
                <h2 className='text-4xl'>Reveal in {counter}</h2>
            ) : (
                <>
                    <h2 className=' flex flex-col gap-8 text-3xl items-center'>
                        The Mismatch is:{' '}
                        <span className={`${revealColor} text-8xl`}>
                            {imposter?.name}
                        </span>
                    </h2>
                    <h2 className=' flex flex-col gap-8 text-3xl items-center'>
                        {revealText}
                    </h2>
                    <div>
                        <h2 className='text-2xl mb-4'>Imposter Question:</h2>
                        <QuestionCard
                            size={'small'}
                            question={questions.imposterQuestion}
                        />
                    </div>
                    {nextGameButton}
                </>
            )}
        </div>
    );
};

export default Reveal;
